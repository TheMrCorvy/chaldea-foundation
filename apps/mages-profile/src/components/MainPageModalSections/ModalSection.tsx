import { FC } from "react";
import Modal from "../Modal";
import { Box, Link } from "@mui/material";
import {
    LayoutWorkExperienceSection,
    StrapiSection,
} from "@repo/type-definitions/dynamic-page";
import WorkExperienceSection from "./WorkExperienceSection";
import ProjectsSection from "./ProjectsSection";

export interface ModalSectionProps {
    isMobile: boolean;
    onCountryClick: (params: string | null) => void;
    open: boolean;
    sections: StrapiSection[];
    countrySelected: string | null;
}

const ModalSection: FC<ModalSectionProps> = ({
    isMobile,
    onCountryClick,
    open,
    sections,
    countrySelected,
}) => {
    const renderModalContent = () => {
        const section = sections.find(
            (section) => section.title === countrySelected
        );

        switch (section?.__component) {
            case "sections.landing-hero-section":
                return null;

            case "sections.work-experience-section":
                return (
                    <WorkExperienceSection
                        {...(section as LayoutWorkExperienceSection)}
                    />
                );

            case "sections.projects-section":
                return <ProjectsSection />;

            default:
                return null;
        }
    };

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
                {renderModalContent()}

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
                    {sections[1] &&
                        (sections[1] as LayoutWorkExperienceSection)
                            .link_to_page && (
                            <Link
                                variant="body1"
                                color="#ffffff"
                                sx={{
                                    mr: isMobile ? "-11px" : "0",
                                }}
                                href={
                                    (sections[1] as LayoutWorkExperienceSection)
                                        ?.link_to_page?.href
                                }
                            >
                                {
                                    (sections[1] as LayoutWorkExperienceSection)
                                        ?.link_to_page?.label
                                }
                            </Link>
                        )}
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalSection;
