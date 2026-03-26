import { NextResponse } from "next/server";
import { getMetricValues } from "@/lib/redisMetrics";

const METRIC_KEYS = [
        "metrics:googleReviews:locations:hit",
        "metrics:googleReviews:locations:miss",
        "metrics:googleReviews:locations:fresh",
        "metrics:googleReviews:testimonials:hit",
        "metrics:googleReviews:testimonials:miss",
        "metrics:googleReviews:testimonials:fresh",
    ] as const;

    export async function GET() {
    const values = await getMetricValues([...METRIC_KEYS]);

    return NextResponse.json(
        {
            metrics: {
                locations: {
                hit: values["metrics:googleReviews:locations:hit"] ?? 0,
                miss: values["metrics:googleReviews:locations:miss"] ?? 0,
                fresh: values["metrics:googleReviews:locations:fresh"] ?? 0,
                },
                testimonials: {
                hit: values["metrics:googleReviews:testimonials:hit"] ?? 0,
                miss: values["metrics:googleReviews:testimonials:miss"] ?? 0,
                fresh: values["metrics:googleReviews:testimonials:fresh"] ?? 0,
                },
            },
        },
        { status: 200 },
    );
}
