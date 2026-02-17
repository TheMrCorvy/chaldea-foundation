import MainPage from "@/components/ClientWrapper";
import { MagesDataProps } from "@/components/MagesData";
import { SoundProvider } from "@/contexts/SoundContext";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";
import {
    DynamicPage,
    LayoutLandingHero,
    LayoutWorkExperienceSection,
} from "@repo/type-definitions/dynamic-page";
import { redirect } from "next/navigation";

export default async function HomePage() {
    const token = process.env.PLATFORM_SERVICE_KEY || "";
    const imageBaseUrl = process.env.IMAGES_SOURCE_URL;

    if (!token || !imageBaseUrl) {
        logData({
            title: "Critical env variable not found",
            layer: "*",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
            data: {
                token,
                imageBaseUrl,
            },
            type: "error",
        });

        return redirect("/404/1");
    }

    const platformService = new PlatformService();
    platformService.setJWT(token);

    const { data } = await platformService.call(
        "aDynamicPageGetADynamicPages",
        {
            query: {
                filters: {
                    slug: {
                        $eq: "main",
                    },
                },
                populate: {
                    sections: {
                        populate: "*",
                    },
                },
            },
        }
    );

    if (!data || !data.data) {
        logData({
            title: "The dynamic page requested doesn't exists",
            layer: "*",
            addSeparatorAfter: true,
            timeStamp: true,
            addSpaceAfter: true,
            data,
            type: "error",
        });
        return redirect("/404/2");
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

    const dynamicPage: DynamicPage = data.data[0];
    const landingHero = dynamicPage.sections[0] as LayoutLandingHero;
    const experienceSection = dynamicPage
        .sections[1] as LayoutWorkExperienceSection;

    const magesData: MagesDataProps = {
        name: landingHero.title as string,
        position: landingHero.highlighted_subtitle,
        profile_image: `${imageBaseUrl}${landingHero.profile_image.url}`,
        commands: `${imageBaseUrl}${landingHero.commands.url}`,
    };

    return (
        <SoundProvider>
            <MainPage
                magesData={magesData}
                experienceSection={experienceSection}
            />
        </SoundProvider>
    );
}
