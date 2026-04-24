import {
    BlogHero,
    BlogImageComponent,
    BlogText,
    LayoutDescriptionWithChipsList,
    LayoutForm,
    LayoutIcon,
    LayoutLandingHero,
    LayoutLink,
    LayoutLogoLoop,
    LayoutWorkExperienceSection,
    SectionsProjectsSection,
    StrapiPDFComponent,
    StrapiSection,
} from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import DynamicProjectsSection from "./DynamicProjectsSection";
import DynamicLandingHeroSection from "./DynamicLandingHeroSection";
import DynamicWorkExperienceSection from "./DynamicWorkExperienceSection";
import DynamicBlogText from "./DynamicBlogText";
import DynamicDescriptionWithChipsList from "./DynamicDescriptionWithChipsList";
import DynamicBlogHero from "./DynamicBlogHero";
import DynamicPdfFile from "./DynamicPdfFile";
import DynamicLink from "./DynamicLink";
import IconComponent from "../IconComponent";
import DynamicForm from "./DynamicForm";
import DynamicBlogImage from "./DynamicBlogImage";
import DynamicLogoLoop from "./DynamicLogoLoop";

export interface DynamicZoneComponentProps {
    section: StrapiSection;
    imageBaseUrl: string;
    isMobile?: boolean;
}

const DynamicZoneComponent: FC<DynamicZoneComponentProps> = ({
    section,
    imageBaseUrl,
    isMobile = false,
}) => {
    switch (section.__component) {
        case "sections.projects-section":
            return (
                <DynamicProjectsSection
                    {...(section as SectionsProjectsSection)}
                    imageBaseUrl={imageBaseUrl}
                />
            );

        case "sections.landing-hero-section":
            return (
                <DynamicLandingHeroSection
                    imageBaseUrl={imageBaseUrl}
                    {...(section as LayoutLandingHero)}
                />
            );

        case "sections.work-experience-section":
            return (
                <DynamicWorkExperienceSection
                    {...(section as LayoutWorkExperienceSection)}
                    isMobile={isMobile}
                />
            );

        case "blog.blog-text":
            return <DynamicBlogText {...(section as BlogText)} />;

        case "sections.contact-section":
            return null; // This section is going to be replaced with a normal form

        case "layout.description-with-chips-list":
            return (
                <DynamicDescriptionWithChipsList
                    {...(section as LayoutDescriptionWithChipsList)}
                    isMobile={isMobile}
                />
            );

        case "blog.blog-hero":
            return <DynamicBlogHero {...(section as BlogHero)} />;

        case "blog.pdf-file":
            return (
                <DynamicPdfFile
                    {...(section as StrapiPDFComponent)}
                    filesBaseUrl={imageBaseUrl}
                />
            );

        case "layout.link":
            return <DynamicLink {...(section as LayoutLink)} />;

        case "layout.icon":
            return (
                <IconComponent
                    {...(section as LayoutIcon)}
                    id={section.component_id}
                />
            );

        case "layout.form":
            return <DynamicForm {...(section as LayoutForm)} />;

        case "blog.blog-image":
            return <DynamicBlogImage {...(section as BlogImageComponent)} />;

        case "layout.logo-loop":
            return (
                <DynamicLogoLoop
                    {...(section as LayoutLogoLoop)}
                    isMobile={isMobile}
                />
            );

        default:
            return null;
    }
};

export default DynamicZoneComponent;
