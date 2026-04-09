import {
    BlogHero,
    BlogText,
    LayoutDescriptionWithChipsList,
    LayoutForm,
    LayoutIcon,
    LayoutLandingHero,
    LayoutLink,
    LayoutWorkExperienceSection,
    SectionsContactSection,
    SectionsProjectsSection,
    StrapiPDFComponent,
    StrapiSection,
} from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import DynamicProjectsSection from "./DynamicProjectsSection";
import DynamicLandingHeroSection from "./DynamicLandingHeroSection";
import DynamicWorkExperienceSection from "./DynamicWorkExperienceSection";
import DynamicBlogText from "./BlogText";
import DynamicDescriptionWithChipsList from "./DynamicDescriptionWithChipsList";
import DynamicBlogHero from "./DynamicBlogHero";
import DynamicPdfFile from "./DynamicPdfFile";
import DynamicLink from "./DynamicLink";
import IconComponent from "../IconComponent";
import DynamicForm from "./DynamicForm";

export interface DynamicZoneComponentProps {
    section: StrapiSection;
}

const DynamicZoneComponent: FC<DynamicZoneComponentProps> = ({ section }) => {
    switch (section.__component) {
        case "sections.projects-section":
            return (
                <DynamicProjectsSection
                    {...(section as SectionsProjectsSection)}
                />
            );

        case "sections.landing-hero-section":
            return (
                <DynamicLandingHeroSection
                    {...(section as LayoutLandingHero)}
                />
            );

        case "sections.work-experience-section":
            return (
                <DynamicWorkExperienceSection
                    {...(section as LayoutWorkExperienceSection)}
                />
            );

        case "blog.blog-text":
            return <DynamicBlogText {...(section as BlogText)} />;

        case "sections.contact-section":
            return "Contact section component is deprecated"; // This section is going to be replaced with a normal form

        case "layout.description-with-chips-list":
            return (
                <DynamicDescriptionWithChipsList
                    {...(section as LayoutDescriptionWithChipsList)}
                />
            );

        case "blog.blog-hero":
            return <DynamicBlogHero {...(section as BlogHero)} />;

        case "blog.pdf-file":
            return <DynamicPdfFile {...(section as StrapiPDFComponent)} />;

        case "layout.link":
            return <DynamicLink {...(section as LayoutLink)} />;

        case "layout.icon":
            return <IconComponent {...(section as LayoutIcon)} />;

        case "layout.form":
            return <DynamicForm {...(section as LayoutForm)} />;

        default:
            return null;
    }
};

export default DynamicZoneComponent;
