"use client";

import GlobeWrapper from "@/components/Globe/GlobeWrapper";
import MagesData, { MagesDataProps } from "@/components/MagesData";
import StarryContainer from "@/components/StarryContainer";
import useClickAnimationAndSounds from "@/hooks/useClickAnimationAndSounds";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { LayoutWorkExperienceSection } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";

export interface MainPageProps {
    magesData: MagesDataProps;
    experienceSection: LayoutWorkExperienceSection;
}

const MainPage: FC<MainPageProps> = ({ magesData, experienceSection }) => {
    const isMobile = useMediaQuery().max.width("sm");
    useClickAnimationAndSounds();

    return (
        <StarryContainer>
            <GlobeWrapper
                isMobile={isMobile}
                experienceSection={experienceSection}
            />
            <MagesData {...magesData} isMobile={isMobile} />
        </StarryContainer>
    );
};

export default MainPage;
