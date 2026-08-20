"use client";

import { FC, useState, useMemo } from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Stack from "@mui/joy/Stack";
import { LanguagesInfo } from "@repo/type-definitions";
import { getLanguageInfo } from "@repo/shared-utils/language-utils";
import CastToTv from "./index";
import CastMasterToTv from "./CastMasterToTv";
import CastPlaylistToTv from "./CastPlaylistToTv";
import { NasApiRoutes } from "@/utils/routes";

export interface CastToTvSelectorProps {
    version: "V1" | "V2";
    fileName: string;
    fileType: string;
    parentDirectory: string;
    languagesInfo: LanguagesInfo | null;
    apiKey: string;
    nasBaseUrl: string;
    audioIndex: number;
    subtitleIndex: number;
    start: number;
    subtitleSrcUrl?: (subsIndex: number) => string | null;
}

type CastMode = "playlist" | "master" | "legacy";

const CastToTvSelector: FC<CastToTvSelectorProps> = ({
    version,
    fileName,
    fileType,
    parentDirectory,
    languagesInfo,
    apiKey,
    nasBaseUrl,
    start,
    audioIndex,
    subtitleIndex,
    subtitleSrcUrl,
}) => {
    const [mode, setMode] = useState<CastMode>("legacy");

    const baseParams = `parentDirectory=${encodeURIComponent(
        parentDirectory
    )}&fileName=${encodeURIComponent(
        fileName
    )}&fileType=${fileType}&audioIndex=${audioIndex}&apiKey=${encodeURIComponent(
        apiKey
    )}`;

    const videoSrcPlaylist = `${nasBaseUrl}${NasApiRoutes.V3_PLAYLIST}?${baseParams}`;
    const videoSrcMaster = `${nasBaseUrl}${NasApiRoutes.V3_MASTER}?${baseParams}`;
    const videoSrcV2 = `${nasBaseUrl}${NasApiRoutes.V2_STREAM_MEDIA}?${baseParams}&start=${start}`;

    const filePath = parentDirectory + "/" + fileName + "." + fileType;
    const realUrl = NasApiRoutes.STREAM_MEDIA;

    const videoSrcV1Url: URL = new URL(realUrl, nasBaseUrl);

    videoSrcV1Url.searchParams.append("filePath", filePath);
    videoSrcV1Url.searchParams.append("apiKey", apiKey);

    if (version === "V1") {
        return <CastToTv videoSrc={videoSrcV1Url.toString()} />;
    }

    const metadata =
        subtitleIndex !== -1 && languagesInfo?.subtitleTracks?.[subtitleIndex]
            ? (() => {
                  const track = languagesInfo.subtitleTracks![subtitleIndex];
                  const languageInfo = getLanguageInfo(track.language, {
                      code2: true,
                      nameSpanish: true,
                  });

                  return {
                      subsLabel: languageInfo?.nameSpanish || track.language,
                      subsLanguage: languageInfo?.code2 || track.language,
                  };
              })()
            : undefined;

    const subtitleSrc =
        (subtitleSrcUrl && subtitleSrcUrl(subtitleIndex)) || undefined;

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Select
                size="sm"
                value={mode}
                onChange={(_, newValue) =>
                    newValue && setMode(newValue as CastMode)
                }
                sx={{ minWidth: 180 }}
            >
                <Option value="legacy">Direct MP4 (V1)</Option>
                <Option value="playlist">HLS Playlist (V3)</Option>
                <Option value="master">HLS Master (V3, legacy)</Option>
            </Select>

            {mode === "playlist" ? (
                <CastPlaylistToTv
                    videoSrc={videoSrcPlaylist}
                    subtitleSrc={subtitleSrc}
                    metadata={metadata}
                />
            ) : mode === "master" ? (
                <CastMasterToTv
                    videoSrc={videoSrcMaster}
                    subtitleSrc={subtitleSrc}
                    metadata={metadata}
                />
            ) : (
                <CastToTv
                    videoSrc={videoSrcV2}
                    subtitleSrc={subtitleSrc}
                    metadata={metadata}
                />
            )}
        </Stack>
    );
};

export default CastToTvSelector;
