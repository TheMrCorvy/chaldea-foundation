"use client";

import { FC, useState } from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Stack from "@mui/joy/Stack";
import { LanguagesInfo } from "@repo/type-definitions";
import { getLanguageInfo } from "@repo/shared-utils/language-utils";
import CastToTv from "./index";
import CastMasterToTv from "./CastMasterToTv";
import CastPlaylistToTv from "./CastPlaylistToTv";

export interface CastToTvSelectorProps {
    version: "V1" | "V2";
    fileName: string;
    fileType: string;
    parentDirectory: string;
    languagesInfo: LanguagesInfo | null;
    apiKey: string;
    nasBaseUrl: string;
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
}) => {
    const [mode, setMode] = useState<CastMode>("playlist");

    const audioIndex = (() => {
        if (!languagesInfo?.audioTracks) return 0;
        const jpnTrack = languagesInfo.audioTracks.find(
            (t) => t.language?.toLowerCase() === "jpn"
        );
        if (jpnTrack) return jpnTrack.trackIndex;
        const unknownTrack = languagesInfo.audioTracks.find(
            (t) => t.language?.toLowerCase() === "unknown"
        );
        if (unknownTrack) return unknownTrack.trackIndex;
        return languagesInfo.audioTracks[0]?.trackIndex ?? 0;
    })();

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
        ? `${nasBaseUrl}/api/v2/serve-episode/subtitles?parentDirectory=${encodeURIComponent(
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
    const videoSrcV1 = `${nasBaseUrl}/api/v1/serve-episode?parentDirectory=${encodeURIComponent(
        parentDirectory
    )}&fileName=${encodeURIComponent(
        fileName
    )}&fileType=${fileType}&apiKey=${encodeURIComponent(apiKey)}`;

    if (version === "V1") {
        return <CastToTv videoSrc={videoSrcV1} />;
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
                    videoSrc={videoSrcV1}
                    subtitleSrc={subtitleSrc}
                    metadata={metadata}
                />
            )}
        </Stack>
    );
};

export default CastToTvSelector;
