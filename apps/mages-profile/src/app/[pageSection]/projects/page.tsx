import ClientSideProjectsPage from "@/components/ClientSideProjectsPage";
import { BGMs, SoundProvider } from "@/contexts/SoundContext";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";
import {
    DynamicPage,
    SectionsProjectsSection,
} from "@repo/type-definitions/dynamic-page";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";

export interface ProjectsPageProps {
    params: Promise<{
        pageSection: string;
        slug: string;
    }>;
}

type DynamicPageResponse = {
    data?: Array<DynamicPage>;
};

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

const getDynamicProjectsPage = cache(async (): Promise<DynamicPage | null> => {
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
                        $eq: "projects",
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
                            "sections.projects-section": {
                                populate: {
                                    link_to_page: {
                                        populate: "*",
                                    },
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
                                            icon: {
                                                populate: "*",
                                            },
                                        },
                                    },
                                },
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
        title: "Result for projects page",
        layer: "external_http_responses",
        addSeparatorAfter: true,
        addSpaceAfter: true,
        data,
        timeStamp: true,
        type: "info",
        addSpaceBefore: true,
    });

    return data.data[0];
});

export const dynamic = "force-dynamic";
export const revalidate = 3600;
export const dynamicParams = false;

export async function generateMetadata(): Promise<Metadata> {
    const dynamicPage = await getDynamicProjectsPage();

    if (!dynamicPage) {
        return NOT_FOUND_METADATA;
    }

    return buildSeoMetadata(dynamicPage);
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
    const { pageSection } = await params;

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

    const dynamicPage = await getDynamicProjectsPage();

    if (!dynamicPage) {
        return redirect("/404/2");
    }

    const allowedSections = dynamicPage.metadata?.allowedSections as
        | string[]
        | undefined;

    if (!allowedSections) {
        return redirect("/404/3");
    }

    if (!allowedSections.includes(pageSection)) {
        return redirect("/404/4");
    }

    return (
        <SoundProvider bgm={dynamicPage.background_music as BGMs}>
            <ClientSideProjectsPage
                projectsSection={
                    dynamicPage.sections[0] as SectionsProjectsSection
                }
            />
        </SoundProvider>
    );
}
