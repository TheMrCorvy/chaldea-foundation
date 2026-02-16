import { FC } from "react";
import Modal from "../Modal";
import { Box, Link } from "@mui/material";
import {
    LayoutWorkExperienceSection,
    StrapiSection,
} from "@repo/type-definitions/dynamic-page";
import WorkExperienceSection from "./WorkExperienceSection";

export interface ModalSectionProps {
    isMobile: boolean;
    onCountryClick: (params: string | null) => void;
    open: boolean;
    experienceSection: LayoutWorkExperienceSection;
}

export interface MainPageSections {
    component_id: string; // country name,
    title: string; // btn's label
    section: StrapiSection;
}

const ModalSection: FC<ModalSectionProps> = ({
    isMobile,
    onCountryClick,
    open,
    experienceSection,
}) => {
    return (
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
                <WorkExperienceSection {...experienceSection} />
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
    );
};

export default ModalSection;
