import { FC } from "react";
import { useChaldeas } from "./useChaldeas";
import AsideHelper from "../AsideHelper";
import { markedCountries } from "./constants";

import { motion } from "framer-motion";
import Modal from "../Modal";
import ExperienceListItem, { ExperienceItem } from "../ExperienceListItem";
import { Box, Link } from "@mui/material";

export interface GlobeProps {
    isMobile: boolean;
}

const Globe: FC<GlobeProps> = ({ isMobile }) => {
    const { mapContainer, onCountryClick, countrySelected, open } = useChaldeas(
        {
            isMobile,
        }
    );

    const experience: ExperienceItem = {
        position: "Fullstack Developer",
        orientation: "Frontend Oriented",
        company: "GlobalLogic",
        client: "YPF",
        startDate: "Dec 2025",
        endDate: "Present",
        body: "Currently working in a demanding frontend-oriented project focused on organizing large amounts of data and presenting it efficiently to minimize backend requests.",
    };

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
            <Modal
                open={open}
                onExit={() => onCountryClick(null)}
                isMobile={isMobile}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        height: "100%",
                        pr: "11px",
                    }}
                >
                    <ExperienceListItem
                        isMobile={isMobile}
                        experience={experience}
                    />
                    <ExperienceListItem
                        isMobile={isMobile}
                        experience={experience}
                    />
                    <ExperienceListItem
                        isMobile={isMobile}
                        experience={experience}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            pl: "11px",
                        }}
                    >
                        <Link variant="body1" color="#ffffff">
                            Close
                        </Link>
                        <Link
                            variant="body1"
                            color="#ffffff"
                            sx={{
                                mr: isMobile ? "-11px" : "0",
                            }}
                        >
                            See more
                        </Link>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default Globe;
