import { NextResponse } from "next/server";
import { getCachedLocationReviews } from "@/lib/googlePlacesReviews";

export async function GET() {
    const payloads = await getCachedLocationReviews();
    return NextResponse.json(payloads, { status: 200 });
}
