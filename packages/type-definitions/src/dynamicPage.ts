export interface DynamicPage {
    documentId: string;
    id: number;
    slug: string;
    title: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt: string;
    sections: Array<StrapiSection>;
}

export interface StrapiComponent {
    __component: string;
    component_id: string;
}

export type StrapiSection = LayoutLandingHero | LayoutWorkExperienceSection;

export interface LayoutLandingHero extends StrapiComponent {
    id: number;
    title: string;
    highlighted_subtitle: string;
    body: Array<JsonRichText>;
    helper_text: string;
    link: Array<LayoutLink>;
    pdf_file: StrapiPDFComponent;
    commands: ImageComponent;
    profile_image: ImageComponent;
    call_to_action: LayoutCallToAction;
}

export interface ImageComponent {
    documentId: string;
    id: number;
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: ImageFormats;
    mime: string;
    url: string; // (relative to strapi, it starts with /uploads/*)
    createdAt?: string;
    updatedAt?: string;
    publishedAt: string;
}

export interface ImageFormats {
    thumbnail: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    large: ImageFormat;
}

export interface ImageFormat {
    name: string;
    hash: string;
    ext: string;
    mime: string;
    path: string | null;
    width: number;
    height: number;
    size: number;
    sizeInBytes: number;
    url: string;
}

export interface LayoutWorkExperienceSection extends StrapiComponent {
    experience_list_items: Array<LayoutWorkExperienceListItem>;
    title: string;
}

export interface LayoutWorkExperienceListItem extends StrapiComponent {
    title: string;
    body: Array<JsonRichText>;
    company: string;
    client?: string;
    location: string;
    orientation?: string;
    popover?: string;
    from: Date;
    until: Date;
}

export interface LayoutLink extends StrapiComponent {
    href: string;
    icon: LayoutIcon;
    label: string;
    popover?: string;
    variant: "link" | "icon_link" | "link_with_icon";
}

export interface LayoutCallToAction {
    link: LayoutLink;
    popover?: string;
    title: string;
}

export interface LayoutIcon extends StrapiComponent {
    name: string;
}

export interface StrapiPDFComponent extends StrapiComponent {
    title: string;
    popover: string | null;
    helper_text: string | null;
}

export interface JsonRichText {
    type: string;
    level?: number;
    format?: string;
    url?: string;
    children?: JsonRichText[];
    text?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: "primary" | "secondary" | "warning" | "info" | "error" | "success";
}
