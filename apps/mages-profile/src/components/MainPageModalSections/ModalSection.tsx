import { FC } from "react";
import Modal from "../Modal";
import { Box, Link } from "@mui/material";
import {
    BlogText,
    LayoutDescriptionWithChipsList,
    LayoutWorkExperienceSection,
    SectionsContactSection,
    SectionsProjectsSection,
    StrapiSection,
} from "@repo/type-definitions/dynamic-page";
import WorkExperienceSection from "./WorkExperienceSection";
import ProjectsSection from "./ProjectsSection";
import AboutMeSection from "./AboutMeSection";
import ContactSection from "./ContactSection";
import MySkills from "./MySkills";

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
    const section = sections.find(
        (section) => section.component_id === countrySelected
    );

    const renderModalContent = () => {
        switch (section?.__component) {
            case "sections.landing-hero-section":
                return null;

            case "sections.work-experience-section":
                return (
                    <WorkExperienceSection
                        isMobile={isMobile}
                        {...(section as LayoutWorkExperienceSection)}
                    />
                );

            case "sections.projects-section":
                return (
                    <ProjectsSection
                        {...(section as SectionsProjectsSection)}
                        isMobile={isMobile}
                    />
                );

            case "blog.blog-hero":
                return (
                    <AboutMeSection
                        isMobile={isMobile}
                        {...(section as BlogText)}
                    />
                );

            case "sections.contact-section":
                return (
                    <ContactSection
                        isMobile={isMobile}
                        {...(section as SectionsContactSection)}
                    />
                );

            case "layout.description-with-chips-list":
                return (
                    <MySkills
                        isMobile={isMobile}
                        {...(section as LayoutDescriptionWithChipsList)}
                    />
                );

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
                    width: "100%",
                }}
            >
                {renderModalContent()}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        px: "11px",
                        pt: "5px",
                        pb: "2px",
                    }}
                >
                    <Link
                        variant="body1"
                        color="#ffffff"
                        underline="hover"
                        sx={{
                            cursor: "pointer",
                            paddingLeft:
                                section?.__component ===
                                "layout.description-with-chips-list"
                                    ? "11px"
                                    : undefined,
                        }}
                        onClick={() => onCountryClick(null)}
                    >
                        Close
                    </Link>
                    {section &&
                        (section as LayoutWorkExperienceSection)
                            .link_to_page && (
                            <Link
                                underline="hover"
                                variant="body1"
                                color="#ffffff"
                                sx={{
                                    mr: isMobile ? "-11px" : "0",
                                }}
                                href={
                                    (section as LayoutWorkExperienceSection)
                                        ?.link_to_page?.href
                                }
                            >
                                {
                                    (section as LayoutWorkExperienceSection)
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
