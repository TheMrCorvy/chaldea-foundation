import { BGMs, SoundProvider } from "@/contexts/SoundContext";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";
import { DynamicPage } from "@repo/type-definitions/dynamic-page";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";

import "../globals.css";
import { dynamicZone, dynamicPageFields } from "@/lib/constants";
import DynamicZoneComponent from "@/components/DynamicZone";
import ClientSideUiEffects from "@/components/DynamicZone/ClientSideUI/ClientSideUiEffects";
import StarryContainer from "@/components/StarryContainer";

export interface dynamicZonePageProps {
    params: Promise<{
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
            images: [
                {
                    url: "/assets/images/cover.webp",
                    width: 1200,
                    height: 630,
                    alt: title || "Site Cover",
                },
            ],
        },
        twitter: {
            title,
            description,
            card: "summary_large_image",
            images: ["/assets/images/cover.webp"],
        },
        ...rawMetadata,
    };

    return metadata;
}

const getDynamicPage = cache(
    async (slug: string): Promise<DynamicPage | null> => {
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
                            $eq: slug,
                        },
                    },
                    fields: dynamicPageFields,
                    populate: {
                        sections: {
                            on: dynamicZone,
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
    }
);

export async function generateMetadata({
    params,
}: dynamicZonePageProps): Promise<Metadata> {
    const { slug } = await params;
    const dynamicPage = await getDynamicPage(slug);

    if (!dynamicPage) {
        return NOT_FOUND_METADATA;
    }

    return buildSeoMetadata(dynamicPage);
}

export default async function DynamicZone({ params }: dynamicZonePageProps) {
    const { slug } = await params;
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

    const dynamicPage = await getDynamicPage(slug);

    if (!dynamicPage) {
        return redirect("/404/2");
    }

    const sections = dynamicPage?.sections || [];

    return (
        <SoundProvider bgm={dynamicPage.background_music as BGMs}>
            <StarryContainer>
                <ClientSideUiEffects routerPush="/" />

                {sections.map((section) => (
                    <DynamicZoneComponent
                        section={section}
                        key={section.component_id}
                    />
                ))}
            </StarryContainer>
        </SoundProvider>
    );
}
