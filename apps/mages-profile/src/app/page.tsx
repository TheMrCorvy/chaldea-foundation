"use client";

import GlobeWrapper from "@/components/Globe/GlobeWrapper";
import HologramGlitchText from "@/components/HologramGlitchText";
import MagesData from "@/components/MagesData";
import StarryContainer from "@/components/StarryContainer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function HomePage() {
    const isMobile = useMediaQuery().max.width("sm");

    return (
        <StarryContainer>
            <>
                <HologramGlitchText
                    sx={{
                        position: "absolute",
                        top: "7%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        whiteSpace: "nowrap",
                    }}
                    variant="h5"
                >
                    Exploratio anima in cosmi somniorum.
                </HologramGlitchText>
                <GlobeWrapper isMobile={isMobile} />
                <MagesData isMobile={isMobile} />
            </>
        </StarryContainer>
    );
}
