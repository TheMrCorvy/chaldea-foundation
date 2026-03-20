import { NextRequest, NextResponse } from "next/server";
import { createReadStream, statSync } from "fs";
import { join } from "path";
import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@repo/shared-utils/feature-flags";

export async function GET(request: NextRequest) {
    if (isFeatureFlagEnabled(FeatureNames.CONSUME_NAS_FILES)) {
        return new NextResponse("There was an error", { status: 500 });
    }

    const filePath = join(
        process.cwd(),
        "src/mocks/mock-episodes/" + process.env.MOCK_FILE_NAME
    );

    const fileMetadata = statSync(filePath);
    const range = request.headers.get("range");

    if (!range) {
        const headers = {
            "Content-Type": "video/mp4",
            "Content-Length": fileMetadata.size.toString(),
            "Accept-Ranges": "bytes",
        };
        const stream = createReadStream(filePath);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new NextResponse(stream as any, { headers });
    }

    const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
    const start = parseInt(startStr, 10);
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new NextResponse(stream as any, {
        headers,
        status: 206, // Partial content
    });
}
