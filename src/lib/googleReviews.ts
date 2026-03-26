import { incrementMetric } from "@/lib/redisMetrics";

const CACHE_SECONDS = 60 * 60 * 24 * 30; // 30 days
const CACHE_KEY = "google:places:testimonials:v1";

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

const readCachedTestimonials = async (): Promise<string[] | null> => {
    const config = getRedisConfig();
    if (!config.canRead) return null;

    const token = config.readToken ?? config.writeToken;
    if (!token) return null;

    try {
        const result = await runRedisCommand(["GET", CACHE_KEY], token);
        if (!result || typeof result !== "string") return null;

        const parsed = JSON.parse(result) as string[];
        return Array.isArray(parsed) ? parsed : null;
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
    } catch {
    }
};

export async function fetchFiveStarReviewTexts(): Promise<string[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_TESTIMONIALS_PLACE_ID;

    if (!apiKey || !placeId) return [];

    const cached = await readCachedTestimonials();
    if (cached) {
        await incrementMetric(TESTIMONIALS_HIT_KEY);
        return cached;
    }

    await incrementMetric(TESTIMONIALS_MISS_KEY);

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
