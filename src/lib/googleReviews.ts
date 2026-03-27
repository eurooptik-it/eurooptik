import { incrementMetric } from "@/lib/redisMetrics";

const CACHE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const CACHE_KEY = "google:places:testimonials:v1";
const STALE_CACHE_KEY = "google:places:testimonials:stale:v1";

const TESTIMONIALS_HIT_KEY = "metrics:googleReviews:testimonials:hit";
const TESTIMONIALS_MISS_KEY = "metrics:googleReviews:testimonials:miss";
const TESTIMONIALS_FRESH_KEY = "metrics:googleReviews:testimonials:fresh";

type PlacesReview = {
    rating: number;
    text?: { text: string; languageCode?: string };
    authorAttribution?: { displayName?: string };
};

type PlacesResponse = {
    reviews?: PlacesReview[];
};

const getRedisConfig = () => {
    const url =
        process.env.STORAGE_KV_REST_API_URL ??
        process.env.KV_REST_API_URL ??
        process.env.UPSTASH_REDIS_REST_URL;
    const readToken =
        process.env.STORAGE_KV_REST_API_READ_ONLY_TOKEN ??
        process.env.KV_REST_API_READ_ONLY_TOKEN;
    const writeToken =
        process.env.STORAGE_KV_REST_API_TOKEN ??
        process.env.KV_REST_API_TOKEN ??
        process.env.UPSTASH_REDIS_REST_TOKEN;

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

const readCachedTestimonials = async (): Promise<string[] | null> => {
    const config = getRedisConfig();
    if (!config.canRead) return null;

    const token = config.readToken ?? config.writeToken;
    if (!token) return null;

    try {
        const freshResult = await runRedisCommand(["GET", CACHE_KEY], token);
        if (freshResult && typeof freshResult === "string") {
            const parsedFresh = JSON.parse(freshResult) as string[];
            if (Array.isArray(parsedFresh)) {
                const config = getRedisConfig();
                if (config.canWrite && config.writeToken) {
                    try {
                        await runRedisCommand(
                            ["SET", STALE_CACHE_KEY, JSON.stringify(parsedFresh)],
                            config.writeToken,
                        );
                    } catch {
                    }
                }

                return parsedFresh;
            }
        }

        const staleResult = await runRedisCommand(["GET", STALE_CACHE_KEY], token);
        if (!staleResult || typeof staleResult !== "string") return null;

        const parsedStale = JSON.parse(staleResult) as string[];
        return Array.isArray(parsedStale) ? parsedStale : null;
    } catch {
        return null;
    }
};

const writeCachedTestimonials = async (reviews: string[]) => {
    const config = getRedisConfig();
    if (!config.canWrite || !config.writeToken) return;

    try {
        await runRedisCommand(
            ["SET", CACHE_KEY, JSON.stringify(reviews), "EX", CACHE_SECONDS],
            config.writeToken,
        );
        await runRedisCommand(
            ["SET", STALE_CACHE_KEY, JSON.stringify(reviews)],
            config.writeToken,
        );
    } catch {
    }
};

export async function fetchFiveStarReviewTexts(): Promise<string[]> {
    const cached = await readCachedTestimonials();
    if (cached) {
        await incrementMetric(TESTIMONIALS_HIT_KEY);
        return cached;
    }

    await incrementMetric(TESTIMONIALS_MISS_KEY);

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_TESTIMONIALS_PLACE_ID;
    const cacheOnlyMode = process.env.GOOGLE_PLACES_CACHE_ONLY === "true";

    if (!apiKey || !placeId || cacheOnlyMode) return [];

    try {
        const res = await fetch(
            `https://places.googleapis.com/v1/places/${placeId}?fields=reviews&key=${apiKey}`,
        );

        if (!res.ok) {
            return [];
        }

        const data: PlacesResponse = await res.json();

        const reviews = (data.reviews ?? [])
            .filter((r) => r.rating === 5 && r.text?.text?.trim())
            .map((r) => r.text!.text.trim());

        await writeCachedTestimonials(reviews);
        await incrementMetric(TESTIMONIALS_FRESH_KEY);

        return reviews;
    } catch {
        return [];
    }
}
