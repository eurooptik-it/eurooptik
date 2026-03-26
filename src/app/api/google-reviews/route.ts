import { NextResponse } from "next/server";
import { getCachedLocationReviews } from "@/lib/googlePlacesReviews";
import type { LocationReviewPayload } from "@/lib/googlePlacesReviews";

type RatedLocationReview = LocationReviewPayload & {
  rating: number;
  reviews: number;
};

export async function GET() {
  try {
    const payloads = await getCachedLocationReviews();

    const valid = payloads
      .filter(
        (item): item is RatedLocationReview =>
          typeof item.rating === "number" && typeof item.reviews === "number"
      )
      .sort((a, b) =>
        b.rating === a.rating
          ? b.reviews - a.reviews
          : b.rating - a.rating
      );

    if (!valid.length) {
      return NextResponse.json(
        { rating: null, reviews: null, location: null },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        rating: valid[0].rating.toFixed(1),
        reviews: valid[0].reviews,
        location: valid[0].name,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[google-reviews]", error);
    return NextResponse.json(
      { rating: null, reviews: null, location: null },
      { status: 200 }
    );
  }
}
