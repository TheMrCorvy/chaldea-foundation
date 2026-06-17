import {
    BlogHero,
    BlogImageComponent,
    BlogLastPosts,
    BlogReadingProgressBar,
    BlogSearchByCategory,
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
import DynamicPdfFile from "../Shared/DynamicPdfFile";
import DynamicLink from "../Shared/DynamicLink";
import IconComponent from "../../IconComponent";
import DynamicForm from "../Shared/DynamicForm";
import DynamicBlogImage from "./DynamicBlogImage";
import DynamicLogoLoop from "./DynamicLogoLoop";
import DynamicLastPosts from "../Shared/DynamicLastPosts";
import DynamicReadingProgressBar from "../Shared/DynamicReadingProgressBar";
import DynamicSearchByCategory from "../Shared/DynamicSearchByCategory";

export interface DynamicZoneComponentProps {
    section: StrapiSection;
    imageBaseUrl: string;
    isMobile?: boolean;
}

const DynamicZoneComponentForClient: FC<DynamicZoneComponentProps> = ({
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
            return (
                <DynamicBlogHero
                    {...(section as BlogHero)}
                    imageBaseUrl={imageBaseUrl}
                />
            );

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
            return (
                <DynamicBlogImage
                    {...(section as BlogImageComponent)}
                    imageBaseUrl={imageBaseUrl}
                />
            );

        case "layout.logo-loop":
            return (
                <DynamicLogoLoop
                    {...(section as LayoutLogoLoop)}
                    isMobile={isMobile}
                />
            );

        case "blog.last-posts":
            return (
                <DynamicLastPosts
                    {...(section as BlogLastPosts)}
                    isMobile={isMobile}
                />
            );
        case "blog.reading-progress-bar":
            return (
                <DynamicReadingProgressBar
                    {...(section as BlogReadingProgressBar)}
                />
            );
        case "blog.search-by-category":
            return (
                <DynamicSearchByCategory
                    {...(section as BlogSearchByCategory)}
                />
            );

        default:
            return null;
    }
};

export default DynamicZoneComponentForClient;
