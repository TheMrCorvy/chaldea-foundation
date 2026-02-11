import MainPage from "@/components/ClientWrapper";
import { SoundProvider } from "@/contexts/SoundContext";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";
import { redirect } from "next/navigation";

export default async function HomePage() {
    const token = process.env.PLATFORM_SERVICE_KEY || "";

    if (!token) {
        logData({
            title: "Critical env variable not found",
            layer: "*",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
            data: {
                token,
            },
            type: "error",
        });

        return redirect("/404");
    }

    const platformService = new PlatformService();
    platformService.setJWT(token);

    const { data } = await platformService.call(
        "aDynamicPageGetADynamicPages",
        {
            query: {
                filters: {
                    slug: {
                        $eq: "cv",
                    },
                },
                populate: "*",
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
        return redirect("/404");
    }

    console.log(data);

    return (
        <SoundProvider>
            <MainPage />
        </SoundProvider>
    );
}
