import { ImageComponent } from "./dynamicPage";

export interface UpdatedResumeWebhookPayload {
    id: number;
    documentId: string;
    model: string;
    createdAt: string;
    entry: UpdatedResume;
}

export interface UpdatedResume {
    id: number;
    documentId: string;
    name: string;
    title: string; // My job title, eg "Fullstack Software Engineer"
    email: string;
    website: string;
    github_profile_link: string;
    web_portfolio_qr_code: ImageComponent;
    background?: string; // markdown
    background_rich_text?: string; // markdown
    experience_list_items: Array<ResumeExperienceListItem>;
    education_list_items: Array<ResumeEducationListItem>;
}

export interface ResumeExperienceListItem {
    id: number;
    company: string;
    client: string;
    position: string;
    from: string; // YYYY-MM-DD / "Present"
    until: string; // YYYY-MM-DD / "Present"
    description: string; // markdown
    location: string;
}

export interface ResumeEducationListItem {
    id: number;
    title: string;
    institute: string;
    from: string; // YYYY-MM-DD / "Present"
    until: string; // YYYY-MM-DD / "Present"
    country: string;
    certification?: string | null;
    certification_date?: string | null;
}

export interface JobRadar {
    job_post_link?: string | null;
    job_title?: string | null;
    seniority?: string | null;
    posted_at?: Date | null;
    company_name?: string | null;
    company_website?: string | null;
    salary?: string | null;
    company_description?: string | null;
    job_post_description?: string | null;
    reason: string;
    applicants_count?: number | null;
    cover_letter?: string | null;
    platform: string;
    custom_cv?: any;
}
