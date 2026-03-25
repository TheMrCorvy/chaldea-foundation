import { FC } from "react";
import { useChaldeas } from "./useChaldeas";
import AsideHelper from "../AsideHelper";
import { selectableCountries } from "./constants";

import { motion } from "framer-motion";
import { StrapiSection } from "@repo/type-definitions/dynamic-page";
import ModalSection from "../MainPageModalSections/ModalSection";

export interface GlobeProps {
    isMobile: boolean;
    sections: StrapiSection[];
}

const Globe: FC<GlobeProps> = ({ isMobile, sections }) => {
    const sectionsTitles = sections.map((section) => section.title) as string[];

    const markedCountries = sectionsTitles.filter((country) =>
        selectableCountries.includes(country)
    ) as string[];

    const { mapContainer, onCountryClick, countrySelected, open } = useChaldeas(
        {
            isMobile,
            markedCountries,
        }
    );

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
                isMobile={isMobile}
                isVisible={!countrySelected}
            />
            <ModalSection
                isMobile={isMobile}
                open={open}
                sections={sections}
                onCountryClick={onCountryClick}
                countrySelected={countrySelected}
            />
        </>
    );
};

export default Globe;
