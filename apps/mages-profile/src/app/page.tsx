import MainPage from "@/components/ClientWrapper";
import { BGMs, SoundProvider } from "@/contexts/SoundContext";
import PlatformService from "@repo/platform-service-sdk";
import {
    FeatureNames,
    isFeatureFlagEnabled,
} from "@repo/shared-utils/feature-flags";
import { logData } from "@repo/shared-utils/log-data";
import { DynamicPage } from "@repo/type-definitions/dynamic-page";
import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

type DynamicPageResponse = {
    data?: Array<DynamicPage>;
};

const DEFAULT_CACHE_REVALIDATION = 3600;

function getMainPageRevalidateSeconds(): number {
    const envValue = process.env.CACHE_REVALIDATION;

    if (!envValue) {
        return DEFAULT_CACHE_REVALIDATION;
    }

    const parsedValue = Number.parseInt(envValue, 10);

    if (Number.isNaN(parsedValue) || parsedValue < 1) {
        logData({
            title: "Invalid MAIN_PAGE_REVALIDATE_SECONDS value",
            layer: "external_http_requests",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
            data: {
                envValue,
                fallback: DEFAULT_CACHE_REVALIDATION,
            },
            type: "error",
        });

        return DEFAULT_CACHE_REVALIDATION;
    }

    return parsedValue;
}

const NOT_FOUND_METADATA: Metadata = {
    title: "404 - Page not found",
    description: "The requested page does not exist.",
    robots: {
        index: false,
        follow: false,
    },
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function buildSeoMetadata(dynamicPage: DynamicPage): Metadata {
    const rawMetadata = isRecord(dynamicPage.metadata)
        ? dynamicPage.metadata
        : {};
    const title = dynamicPage.title;
    const description = dynamicPage.description;
    const metadata: Metadata = {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
        },
        twitter: {
            title,
            description,
            card: "summary_large_image",
        },
        ...rawMetadata,
    };

    return metadata;
}

const getMainDynamicPage = async (): Promise<DynamicPage | null> => {
    const token = process.env.PLATFORM_SERVICE_KEY || "";

    if (!token) {
        logData({
            title: "Critical env variable not found",
            layer: "external_http_requests",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
            data: { token },
            type: "error",
        });

        return null;
    }

    const platformService = new PlatformService();
    platformService.setJWT(token);

    const { data } = (await platformService.call(
        "aDynamicPageGetADynamicPages",
        {
            query: {
                filters: {
                    slug: {
                        $eq: "main",
                    },
                },
                fields: [
                    "slug",
                    "title",
                    "description",
                    "metadata",
                    "background_music",
                ],
                populate: {
                    sections: {
                        on: {
                            "sections.landing-hero-section": {
                                populate: "*",
                            },
                            "sections.work-experience-section": {
                                populate: "*",
                            },
                            "sections.projects-section": {
                                populate: {
                                    projects: {
                                        populate: {
                                            body: {
                                                populate: {
                                                    chips: {
                                                        populate: {
                                                            icon: {
                                                                populate: "*",
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                            links: {
                                                populate: {
                                                    icon: {
                                                        populate: "*",
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            "blog.blog-text": {
                                populate: "*",
                            },
                        },
                    },
                },
            },
        }
    )) as { data?: DynamicPageResponse };

    if (!data || !data.data || data.data.length === 0) {
        logData({
            title: "The dynamic page requested doesn't exists",
            layer: "external_http_responses",
            addSeparatorAfter: true,
            timeStamp: true,
            addSpaceAfter: true,
            data,
            type: "error",
        });

        return null;
    }

    logData({
        title: "Result for main page",
        layer: "external_http_responses",
        addSeparatorAfter: true,
        addSpaceAfter: true,
        data,
        timeStamp: true,
        type: "info",
        addSpaceBefore: true,
    });

    return data.data[0];
};

const getMainDynamicPageCached = unstable_cache(
    getMainDynamicPage,
    ["main-dynamic-page"],
    { revalidate: getMainPageRevalidateSeconds() }
);

const getMainDynamicPageOptional = async (): Promise<DynamicPage | null> => {
    return isFeatureFlagEnabled(FeatureNames.CACHE_MEMORY)
        ? getMainDynamicPageCached()
        : getMainDynamicPage();
};

export async function generateMetadata(): Promise<Metadata> {
    const dynamicPage = await getMainDynamicPageOptional();

    if (!dynamicPage) {
        return NOT_FOUND_METADATA;
    }

    return buildSeoMetadata(dynamicPage);
}

export default async function HomePage() {
    const imageBaseUrl = process.env.IMAGES_SOURCE_URL;

    if (!imageBaseUrl) {
        logData({
            title: "Critical env variable not found",
            layer: "external_http_requests",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
            data: {
                imageBaseUrl,
            },
            type: "error",
        });

        return redirect("/404/1");
    }

    const dynamicPage = await getMainDynamicPageOptional();

    if (!dynamicPage) {
        return redirect("/404/2");
    }

    return (
        <SoundProvider bgm={dynamicPage.background_music as BGMs}>
            <MainPage
                sections={dynamicPage.sections}
                imagesBaseUrl={imageBaseUrl}
            />
        </SoundProvider>
    );
}
