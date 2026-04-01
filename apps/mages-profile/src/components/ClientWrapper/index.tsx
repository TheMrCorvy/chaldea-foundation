"use client";

import GlobeWrapper from "@/components/Globe/GlobeWrapper";
import MagesData, { MagesDataProps } from "@/components/MagesData";
import StarryContainer from "@/components/StarryContainer";
import useClickAnimationAndSounds from "@/hooks/useClickAnimationAndSounds";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
    LayoutLandingHero,
    StrapiSection,
} from "@repo/type-definitions/dynamic-page";
import { FC } from "react";

export interface MainPageProps {
    sections: StrapiSection[];
    imagesBaseUrl: string;
}

const MainPage: FC<MainPageProps> = ({ sections, imagesBaseUrl }) => {
    const isMobile = useMediaQuery().max.width("sm");
    useClickAnimationAndSounds();

    const magesDataSection = sections[0] as LayoutLandingHero;

    const magesData: MagesDataProps = {
        name: magesDataSection.title as string,
        position: magesDataSection.highlighted_subtitle || "",
        profile_image:
            imagesBaseUrl +
            magesDataSection.profile_image.formats.thumbnail.url,
        commands: imagesBaseUrl + magesDataSection.commands.url,
    };

    return (
        <StarryContainer>
            <GlobeWrapper isMobile={isMobile} sections={sections} />
            <MagesData {...magesData} isMobile={isMobile} />
        </StarryContainer>
    );
};

export default MainPage;
