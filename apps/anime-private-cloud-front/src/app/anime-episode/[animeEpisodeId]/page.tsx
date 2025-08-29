import { notFound, redirect } from "next/navigation";

import { Page } from "@/types/nextjs";
import { StrapiService } from "@/services/StrapiService";
import { CookiesList, getCookie, JwtCookie, UserCookie } from "@/utils/cookies";
import { ApiRoutes, WebRoutes } from "@/utils/routes";
import { AnimeEpisode, RoleTypes } from "@/types/StrapiSDK";

import { Link, Divider } from "@nextui-org/react";
import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@/services/featureFlagService";
import SecureVideoPlayer from "@/components/SecureVideoPlayer";

export default async function AnimeEpisodes({ params }: Page) {
    const jwt = (await getCookie(CookiesList.JWT)) as JwtCookie | null;
    const user = (await getCookie(CookiesList.USER)) as UserCookie | null;
    const consumeNasData = isFeatureFlagEnabled(FeatureNames.CONSUME_NAS_FILES);
    const nasApiKey = process.env.NAS_API_KEY;
    const nasBaseUrl = process.env.NAS_API_HOST;

    if (!jwt || !user) {
        return redirect(WebRoutes.login);
    }

    if ((!nasApiKey || !nasBaseUrl) && consumeNasData) {
        return notFound();
    }

    const service = StrapiService();
    const animeEpisode = await service.getSingleAnimeEpisode({
        jwt: jwt.jwt,
        id: params.animeEpisodeId,
        queryParams: {
            populate: ["parent_directory"],
        },
    });

    if (
        "error" in animeEpisode ||
        !animeEpisode.data?.parent_directory ||
        (animeEpisode.data.parent_directory.adult &&
            user.role.type === RoleTypes.ANIME_WATCHER)
    ) {
        console.error(animeEpisode);
        return notFound();
    }

    const foundAnimeEpisode = animeEpisode.data as AnimeEpisode;

    return (
        <article className="flex flex-col">
            <section
                className={`flex flex-col lg:flex-row w-full mb-5 justify-between`}
            >
                <Link
                    href={WebRoutes.home}
                    size="lg"
                    color="foreground"
                    underline="always"
                    showAnchorIcon
                >
                    Volver al Inicio
                </Link>
                <h1 className={`text-xl font-medium capitalize mt-3 lg:mt-0`}>
                    {foundAnimeEpisode.display_name}
                </h1>
                <Link
                    href={
                        WebRoutes.directory +
                        foundAnimeEpisode.parent_directory?.documentId
                    }
                    size="lg"
                    color="foreground"
                    underline="always"
                    showAnchorIcon
                    className="mt-3 lg:mt-0"
                >
                    Volver a la Carpeta Anterior
                </Link>
            </section>
            <Divider className="mb-8" />
            <section>
                {consumeNasData ? (
                    <SecureVideoPlayer
                        filePath={foundAnimeEpisode.file_path}
                        apiKey={nasApiKey as string}
                        baseUrl={nasBaseUrl as string}
                    />
                ) : (
                    <video
                        controls
                        width="800"
                        src={ApiRoutes.streamAnimeEpisode}
                        style={{ maxWidth: "100%" }}
                    >
                        Your browser does not support the video tag.
                    </video>
                )}
            </section>
        </article>
    );
}
