import { unstable_cache } from "next/cache";
import { clinicLocations } from "@/lib/locations";

const FIELDS = "rating,userRatingCount";
const CACHE_SECONDS = 60 * 60 * 24 * 7;

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

export const getCachedLocationReviews = unstable_cache(
    fetchLocationReviewsRaw,
    ["google-places-location-reviews"],
    { revalidate: CACHE_SECONDS },
);
