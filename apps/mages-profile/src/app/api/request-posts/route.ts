import { requestPosts } from "@/lib/requestPosts";
import { logData } from "@repo/shared-utils/log-data";
import { LayoutToolChip } from "@repo/type-definitions/dynamic-page";
import { NextResponse } from "next/server";

const methodNotAllowed = () =>
    NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });

interface RequestPostsBody {
    posts_count?: number;
    related_posts?: Array<LayoutToolChip> | null;
    pageNumber?: number;
    category?: string;
    searchQuery?: string;
}

export async function POST(request: Request) {
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
        const body = (await request.json()) as RequestPostsBody;
        const posts_count =
            typeof body.posts_count === "number" && body.posts_count > 0
                ? body.posts_count
                : 5;
        const related_posts =
            Array.isArray(body.related_posts) || body.related_posts === null
                ? body.related_posts
                : undefined;

        const { data, meta } = await requestPosts({
            apiKey,
            posts_count,
            related_posts,
            pageNumber: body.pageNumber || 1,
            category: body.category,
            searchQuery: body.searchQuery,
        });

        return NextResponse.json({ data, meta }, { status: 200 });
    } catch (error) {
        logData({
            type: "error",
            title: "Failed to process request-posts endpoint",
            data: { error },
            layer: "internal_http_requests",
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

export function GET() {
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
