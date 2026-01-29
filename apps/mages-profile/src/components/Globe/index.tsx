import { FC } from "react";
import { useChaldeas } from "./useChaldeas";
import AsideHelper from "../AsideHelper";
import { markedCountries } from "./constants";

import { motion } from "framer-motion";

export interface GlobeProps {
    isMobile: boolean;
}

const Globe: FC<GlobeProps> = ({ isMobile }) => {
    const { mapContainer, onCountryClick, countrySelected } = useChaldeas({
        isMobile,
    });

    return (
        <>
            <motion.section
                ref={mapContainer}
                initial={{
                    opacity: 0,
                    scale: 0.1,
                    clipPath: "circle(0% at 50% 50%)",
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    clipPath: "circle(100% at 50% 50%)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "40rem",
                    width: "40rem",
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <AsideHelper
                markedCountries={markedCountries}
                handleClick={onCountryClick}
                countrySelected={countrySelected}
            />
        </>
    );
};

export default Globe;
