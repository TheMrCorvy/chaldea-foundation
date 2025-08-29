import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { join } from "path";
import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@/services/featureFlagService";

export async function GET(request: NextRequest) {
    if (isFeatureFlagEnabled(FeatureNames.CONSUME_NAS_FILES)) {
        return new NextResponse("There was an error", { status: 500 });
    }

    const filePath = join(
        process.cwd(),
        "src/mocks/mockAnimeEpisodes/" + process.env.MOCK_FILE_NAME
    );

    try {
        const fileMetadata = statSync(filePath);
        const range = request.headers.get("range");

        if (!range) {
            const headers = {
                "Content-Type": "video/mp4",
                "Content-Length": fileMetadata.size.toString(),
                "Accept-Ranges": "bytes",
            };
            const stream = createReadStream(filePath);

            return new NextResponse(stream as any, { headers });
        }

        const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
        const start = parseInt(startStr || "0", 10);
        const end = endStr ? parseInt(endStr, 10) : fileMetadata.size - 1;

        if (start >= fileMetadata.size || end >= fileMetadata.size) {
            return new NextResponse("Range Not Satisfiable", { status: 416 });
        }

        const chunkSize = end - start + 1;
        const stream = createReadStream(filePath, { start, end });

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${fileMetadata.size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize.toString(),
            "Content-Type": "video/mp4",
        };

        return new NextResponse(stream as any, {
            headers,
            status: 206, // Partial content
        });
    } catch (error) {
        console.error("Error streaming video:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
