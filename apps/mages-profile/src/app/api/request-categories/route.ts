import requestCategories from "@/lib/requestCategories";
import { logData } from "@repo/shared-utils/log-data";
import { NextResponse } from "next/server";

const methodNotAllowed = () =>
    NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });

export async function GET() {
    const apiKey = process.env.PLATFORM_SERVICE_KEY || "";

    if (!apiKey) {
        logData({
            type: "error",
            title: "Missing PLATFORM_SERVICE_KEY env variable",
            layer: "internal_http_requests",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        return NextResponse.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    try {
        const { data, meta } = await requestCategories({ apiKey });
        return NextResponse.json({ data, meta }, { status: 200 });
    } catch (error) {
        logData({
            type: "error",
            title: "Failed to process request-categories endpoint",
            data: { error },
            layer: "external_http_requests",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export function POST() {
    return methodNotAllowed();
}

export function PUT() {
    return methodNotAllowed();
}

export function PATCH() {
    return methodNotAllowed();
}

export function DELETE() {
    return methodNotAllowed();
}
