import { ImageComponent } from "./dynamicPage";

export interface UpdatedResume {
    id: number;
    documentId: string;
    name: string;
    title: string; // My job title, eg "Fullstack Software Engineer"
    email: string;
    website: string;
    github_profile_link: string;
    web_portfolio_qr_code: ImageComponent;
    background: string; // markdown
    experience_list_items: Array<ResumeExperienceListItem>;
    education_list_items: Array<ResumeEducationListItem>;
}

export interface ResumeExperienceListItem {
    id: number;
    documentId: string;
    company: string;
    client: string;
    position: string;
    from: string; // YYYY-MM-DD / "Present"
    until: string; // YYYY-MM-DD / "Present"
    description: string; // markdown
}

export interface ResumeEducationListItem {
    id: number;
    documentId: string;
    title: string;
    institute: string;
    from: string; // YYYY-MM-DD / "Present"
    until: string; // YYYY-MM-DD / "Present"
    country: string;
}
