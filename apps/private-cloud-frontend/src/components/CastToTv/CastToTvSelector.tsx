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
    audioIndex: number; // Optional audio index for V2 streaming
    subtitleIndex: number; // Optional subtitle index for V2 streaming
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

    // Find the default subtitle track by searching — not by array index
    const defaultSubtitleTrack = (() => {
        if (!languagesInfo?.audioTracks || !languagesInfo?.subtitleTracks)
            return null;
        const jpnTrack = languagesInfo.audioTracks.find(
            (t) => t.language?.toLowerCase() === "jpn"
        );
        const unknownTrack = languagesInfo.audioTracks.find(
            (t) => t.language?.toLowerCase() === "unknown"
        );
        const defaultAudioTrack =
            jpnTrack || unknownTrack || languagesInfo.audioTracks[0];
        const defaultAudioLang = defaultAudioTrack?.language?.toLowerCase();

        if (defaultAudioLang === "jpn" || defaultAudioLang === "unknown") {
            return (
                languagesInfo.subtitleTracks.find((t) => {
                    const l = t.language?.toLowerCase();
                    return l === "esp" || l === "spa" || l === "es";
                }) ?? null
            );
        }
        return null;
    })();

    const subtitleSrc = defaultSubtitleTrack
        ? `${nasBaseUrl}${NasApiRoutes.V2_SERVE_SUBTITLES}?parentDirectory=${encodeURIComponent(
              parentDirectory
          )}&fileName=${encodeURIComponent(
              fileName
          )}&apiKey=${encodeURIComponent(
              apiKey
          )}&subtitleIndex=${defaultSubtitleTrack.trackIndex}`
        : undefined;

    const metadata = (() => {
        if (!defaultSubtitleTrack) return undefined;
        const languageInfo = getLanguageInfo(defaultSubtitleTrack.language, {
            code2: true,
            nameSpanish: true,
        });
        return {
            subsLabel:
                languageInfo?.nameSpanish ||
                defaultSubtitleTrack.language ||
                "Spanish",
            subsLanguage:
                languageInfo?.code2 || defaultSubtitleTrack.language || "es",
        };
    })();

    const baseParams = `parentDirectory=${encodeURIComponent(
        parentDirectory
    )}&fileName=${encodeURIComponent(
        fileName
    )}&fileType=${fileType}&audioIndex=${audioIndex}&apiKey=${encodeURIComponent(
        apiKey
    )}`;

    const videoSrcPlaylist = `${nasBaseUrl}/api/v3/serve-episode/playlist.m3u8?${baseParams}`;
    const videoSrcMaster = `${nasBaseUrl}/api/v3/serve-episode/master.m3u8?${baseParams}`;

    const filePath = parentDirectory + "/" + fileName + "." + fileType;
    const realUrl = NasApiRoutes.STREAM_MEDIA;

    const videoSrcV1Url: URL = new URL(realUrl, nasBaseUrl);

    videoSrcV1Url.searchParams.append("filePath", filePath);
    videoSrcV1Url.searchParams.append("apiKey", apiKey);

    const videoSrcV2 = useMemo(() => {
        let url = `${nasBaseUrl}${NasApiRoutes.V2_STREAM_MEDIA}?fileType=${fileType}&parentDirectory=${encodeURIComponent(
            parentDirectory
        )}&fileName=${encodeURIComponent(
            fileName
        )}&apiKey=${encodeURIComponent(apiKey)}&audioIndex=${audioIndex}`;

        if (start > 0) {
            url += `&start=${start}`;
        }

        return url;
    }, [
        apiKey,
        fileName,
        fileType,
        nasBaseUrl,
        parentDirectory,
        audioIndex,
        start,
    ]);

    if (version === "V1") {
        return <CastToTv videoSrc={videoSrcV1Url.toString()} />;
    }

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
                <Option value="playlist">HLS Playlist (V3)</Option>
                <Option value="master">HLS Master (V3, legacy)</Option>
                <Option value="legacy">Direct MP4 (V1)</Option>
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
                    subtitleSrc={
                        (subtitleSrcUrl && subtitleSrcUrl(subtitleIndex)) ||
                        undefined
                    }
                    metadata={
                        subtitleIndex !== -1 &&
                        languagesInfo?.subtitleTracks?.[subtitleIndex]
                            ? (() => {
                                  const track =
                                      languagesInfo.subtitleTracks![
                                          subtitleIndex
                                      ];
                                  const languageInfo = getLanguageInfo(
                                      track.language,
                                      {
                                          code2: true,
                                          nameSpanish: true,
                                      }
                                  );

                                  return {
                                      subsLabel:
                                          languageInfo?.nameSpanish ||
                                          track.language,
                                      subsLanguage:
                                          languageInfo?.code2 || track.language,
                                  };
                              })()
                            : undefined
                    }
                />
            )}
        </Stack>
    );
};

export default CastToTvSelector;
