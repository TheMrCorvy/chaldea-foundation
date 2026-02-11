"use client";

import GlobeWrapper from "@/components/Globe/GlobeWrapper";
import MagesData from "@/components/MagesData";
import StarryContainer from "@/components/StarryContainer";
import useClickAnimationAndSounds from "@/hooks/useClickAnimationAndSounds";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { FC } from "react";

export interface MainPageProps {}

const MainPage: FC = () => {
    const isMobile = useMediaQuery().max.width("sm");
    useClickAnimationAndSounds();

    return (
        <StarryContainer>
            <GlobeWrapper isMobile={isMobile} />
            <MagesData isMobile={isMobile} />
        </StarryContainer>
    );
};

export default MainPage;
