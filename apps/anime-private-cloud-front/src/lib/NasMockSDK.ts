import { FeatureNames } from "@/services/featureFlagService";
import { HttpMethod } from "@/services/HttpBase";
import {
    CaseRangeAvailableOnReqHeaders,
    CaseRagneNotSatisfiable,
    ServeEpisodeResponse,
    ServeEpisodeRequest,
} from "@/types/NasSDK";
import logData from "@/utils/logData";
import { NasApiRoutes } from "@/utils/routes";
import { createReadStream, statSync } from "fs";
import { join } from "path";

const host = process.env.NAS_API_HOST as string;

export default class NasMockSDK {
    public async serveEpisode(
        req: ServeEpisodeRequest
    ): Promise<ServeEpisodeResponse> {
        const method = HttpMethod.GET;
        const url = NasApiRoutes.serveAnimeEpisode;
        const uri = `${host}${url}/${req.filePath}`;

        logData({
            data: {
                uri,
                method,
            },
            ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
            title: "serveEpisode",
        });

        const localFilePath = join(process.cwd(), req.filePath);
        const fileMetadata = statSync(localFilePath);
        const range = req.range;

        if (!range) {
            const headers = {
                "Content-Type": "video/mp4",
                "Content-Length": fileMetadata.size.toString(),
                "Accept-Ranges": "bytes",
            };
            const stream = createReadStream(localFilePath);

            return { headers, stream } as CaseRangeAvailableOnReqHeaders;
        }

        const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
        const start = parseInt(startStr || "0", 10);
        const end = endStr ? parseInt(endStr, 10) : fileMetadata.size - 1;

        if (start >= fileMetadata.size || end >= fileMetadata.size) {
            return {
                message: "Range Not Satisfiable",
                status: 416,
            } as CaseRagneNotSatisfiable;
        }

        const chunkSize = end - start + 1;
        const stream = createReadStream(localFilePath, { start, end });
        const headers: HeadersInit = {
            "Content-Range": `bytes ${start}-${end}/${fileMetadata.size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize.toString(),
            "Content-Type": "video/mp4",
        };

        return {
            stream,
            headers,
            status: 206,
        } as CaseRangeAvailableOnReqHeaders;
    }
}
