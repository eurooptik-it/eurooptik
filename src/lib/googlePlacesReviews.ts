import { clinicLocations } from "@/lib/locations";
import { incrementMetric } from "@/lib/redisMetrics";

const FIELDS = "rating,userRatingCount";
const CACHE_SECONDS = 60 * 60 * 24 * 7;
const CACHE_KEY = "google:places:location-reviews:v1";
const LOCATION_HIT_KEY = "metrics:googleReviews:locations:hit";
const LOCATION_MISS_KEY = "metrics:googleReviews:locations:miss";
const LOCATION_FRESH_KEY = "metrics:googleReviews:locations:fresh";

export type LocationReviewPayload = {
    id: string;
    name: string;
    rating: number | null;
    reviews: number | null;
};

const emptyPayload = (): LocationReviewPayload[] =>
    clinicLocations.map((location) => ({
        id: location.id,
        name: location.name,
        rating: null,
        reviews: null,
    }));

const getRedisConfig = () => {
    const url = process.env.STORAGE_KV_REST_API_URL;
    const readToken = process.env.STORAGE_KV_REST_API_READ_ONLY_TOKEN;
    const writeToken = process.env.STORAGE_KV_REST_API_TOKEN;

    return {
        url,
        readToken,
        writeToken,
        canRead: Boolean(url && (readToken || writeToken)),
        canWrite: Boolean(url && writeToken),
    };
};

const runRedisCommand = async (
    command: Array<string | number>,
    token: string,
): Promise<unknown> => {
    const { url } = getRedisConfig();
    if (!url) return null;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Redis command failed: ${response.status}`);
    }

    const json = (await response.json()) as { result?: unknown };
    return json.result ?? null;
};

const readCachedReviews = async (): Promise<LocationReviewPayload[] | null> => {
    const config = getRedisConfig();
    if (!config.canRead || !config.url) return null;

    const token = config.readToken ?? config.writeToken;
    if (!token) return null;

    try {
        const result = await runRedisCommand(["GET", CACHE_KEY], token);
        if (!result || typeof result !== "string") return null;

        const parsed = JSON.parse(result) as LocationReviewPayload[];
        if (!Array.isArray(parsed)) return null;

        return parsed;
    } catch {
        return null;
    }
};

const writeCachedReviews = async (payload: LocationReviewPayload[]) => {
    const config = getRedisConfig();
    if (!config.canWrite || !config.writeToken) return;

    try {
        await runRedisCommand(
            ["SET", CACHE_KEY, JSON.stringify(payload), "EX", CACHE_SECONDS],
            config.writeToken,
        );
    } catch {
        // Ignore Redis write failures; API should still return fresh data.
    }
};

const fetchLocationReviewsRaw = async (): Promise<LocationReviewPayload[]> => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
        return emptyPayload();
    }

    try {
        const payloads = await Promise.all(
            clinicLocations.map(async (location) => {
                if (!location.placeId) {
                    return {
                        id: location.id,
                        name: location.name,
                        rating: null,
                        reviews: null,
                    } as LocationReviewPayload;
                }

                const response = await fetch(
                    `https://places.googleapis.com/v1/places/${location.placeId}?fields=${FIELDS}&key=${apiKey}`,
                );

                if (!response.ok) {
                    return {
                        id: location.id,
                        name: location.name,
                        rating: null,
                        reviews: null,
                    } as LocationReviewPayload;
                }

                const data = await response.json();

                return {
                    id: location.id,
                    name: location.name,
                    rating: typeof data.rating === "number" ? data.rating : null,
                    reviews:
                        typeof data.userRatingCount === "number"
                            ? data.userRatingCount
                            : null,
                } as LocationReviewPayload;
            }),
        );

        return payloads;
    } catch (error) {
        console.error("[google-reviews:shared]", error);
        return emptyPayload();
    }
};

export const getCachedLocationReviews = async (): Promise<LocationReviewPayload[]> => {
    const cached = await readCachedReviews();
    if (cached) {
        await incrementMetric(LOCATION_HIT_KEY);
        return cached;
    }

    await incrementMetric(LOCATION_MISS_KEY);
    const fresh = await fetchLocationReviewsRaw();
    await writeCachedReviews(fresh);
    await incrementMetric(LOCATION_FRESH_KEY);
    return fresh;
};
