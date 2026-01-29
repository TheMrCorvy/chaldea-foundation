"use client";

import GlobeWrapper from "@/components/Globe/GlobeWrapper";
import MagesData from "@/components/MagesData";
import StarryContainer from "@/components/StarryContainer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function HomePage() {
    const isMobile = useMediaQuery().max.width("sm");

    return (
        <StarryContainer>
            <>
                <GlobeWrapper isMobile={isMobile} />
                <MagesData isMobile={isMobile} />
            </>
        </StarryContainer>
    );
}
