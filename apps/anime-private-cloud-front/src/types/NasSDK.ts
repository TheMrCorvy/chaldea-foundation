import { ReadStream } from "fs";

export interface ServeEpisodeRequest {
    filePath: string;
    range: string | null;
}

export interface CaseRangeAvailableOnReqHeaders {
    headers: HeadersInit;
    stream: ReadStream;
    status?: number;
}

export interface CaseRagneNotSatisfiable {
    message: string;
    status: number;
}

export type ServeEpisodeResponse =
    | CaseRagneNotSatisfiable
    | CaseRangeAvailableOnReqHeaders;

export type ServeEpisode = (
    req: ServeEpisodeRequest
) => Promise<ServeEpisodeResponse>;

export interface NasSDK {
    serveEpisode: ServeEpisode;
}
