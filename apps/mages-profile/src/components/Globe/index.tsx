import { FC } from "react";
import { useChaldeas } from "./useChaldeas";
import AsideHelper from "../AsideHelper";
import { markedCountries } from "./constants";

import { motion } from "framer-motion";
import Modal from "../Modal";

export interface GlobeProps {
    isMobile: boolean;
}

const Globe: FC<GlobeProps> = ({ isMobile }) => {
    const { mapContainer, onCountryClick, countrySelected, open } = useChaldeas(
        {
            isMobile,
        }
    );

    // const textPosition = () => {
    //     if (isMobile) {
    //         return {
    //             bottom: "20%",
    //         };
    //     }

    //     return {
    //         top: "7%",
    //     };
    // };

    return (
        <>
            {/* <HologramGlitchText
                sx={{
                    position: "absolute",
                    ...textPosition(),
                    left: "50%",
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                }}
                variant={isMobile ? "subtitle1" : "h5"}
            >
                Exploratio anima in cosmi somniorum
            </HologramGlitchText> */}
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
            <Modal
                open={open}
                onExit={() => onCountryClick(null)}
                isMobile={isMobile}
            >
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Cumque, sapiente soluta aspernatur sed doloremque qui nobis
                    dolorum reiciendis quia blanditiis error ipsa fuga
                    consectetur, corrupti saepe sit, accusamus eius consequatur.
                </p>
            </Modal>
        </>
    );
};

export default Globe;
