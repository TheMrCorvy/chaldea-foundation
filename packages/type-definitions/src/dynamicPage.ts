export interface DynamicPage {
    documentId: string;
    id: number;
    slug: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt: string;
    sections: Array<StrapiSection>;
    title: string;
    metadata: Record<string, unknown>;
    background_music: string;
}

export interface StrapiComponent {
    __component: string;
    component_id: string;
    title: string | null;
}

export type StrapiSection =
    | LayoutLandingHero
    | LayoutWorkExperienceSection
    | SectionsProjectsSection
    | SectionsContactSection
    | BlogHero
    | BlogText
    | StrapiPDFComponent
    | BlogImageComponent
    | LayoutLink
    | LayoutIcon
    | LayoutForm
    | LayoutDescriptionWithChipsList;

export interface DynamicPageSections {
    [key: string]: StrapiSection;
}

export interface LayoutLandingHero extends StrapiComponent {
    id: number;
    highlighted_subtitle?: string;
    body: Array<JsonRichText>;
    helper_text?: string;
    pdf_file?: StrapiPDFComponent;
    commands: ImageComponent;
    profile_image: ImageComponent;
    call_to_actions?: Array<LayoutLink>;
    highlighted_text_color?: TextColors | null;
}

export interface BlogImageComponent extends StrapiComponent {
    body: string;
    alt: string;
    height: number;
    width: number;
    image: ImageComponent;
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
    link_to_page?: LayoutLink | null;
    color: string | null;
}

export interface LayoutWorkExperienceListItem extends StrapiComponent {
    body: Array<JsonRichText>;
    company: string;
    client?: string;
    location: string;
    orientation?: string;
    popover?: string;
    from: Date;
    until: Date;
    font_size: string | null;
    line_height: number | null;
    text_align?: "left" | "center" | "right" | null;
    highlighted_text_color?: TextColors | null;
    color: string | null;
}

export interface LayoutLink extends StrapiComponent {
    href: string;
    icon?: LayoutIcon;
    label: string;
    popover?: string;
    variant: "link" | "icon_link" | "link_with_icon";
    target?: "_blank" | "_self" | "_parent" | "_top";
    color?: TextColors | null;
}

export interface LayoutIcon extends StrapiComponent {
    name: any;
    size?: "inherit" | "small" | "medium" | "large" | null;
    color:
        | "primary"
        | "secondary"
        | "warning"
        | "info"
        | "error"
        | "success"
        | "disabled"
        | "inherit"
        | "action";
}

export interface StrapiPDFComponent extends StrapiComponent {
    popover?: string | null;
    helper_text?: string | null;
    file: unknown;
    icon?: LayoutIcon | null;
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
}

export interface SectionsProjectsSection extends StrapiComponent {
    link_to_page?: LayoutLink | null;
    projects: Array<LayoutProjectListItem>;
}

export interface LayoutToolChip extends StrapiComponent {
    popover: string;
    icon?: LayoutIcon | null;
}

export interface LayoutDescriptionWithChipsList extends StrapiComponent {
    body: Array<JsonRichText>;
    font_size: string | null;
    line_height: number | null;
    color: string | null;
    chips?: Array<LayoutToolChip>;
    text_align?: "left" | "center" | "right" | null;
    highlighted_text_color?: TextColors | null;
}

export interface LayoutProjectListItem extends StrapiComponent {
    highlighted_subtitle?: string | null;
    popover?: string | null;
    icon?: LayoutIcon;
    body: LayoutDescriptionWithChipsList;
    cover_image?: ImageComponent | null;
    links: Array<LayoutLink>;
    disable_primary_link?: boolean;
}

export interface LayoutFormInput extends StrapiComponent {
    name: string;
    default_value?: string | null;
    type:
        | "input"
        | "submit"
        | "textarea"
        | "select"
        | "date"
        | "slider"
        | "range";
    option?: Array<LayoutSelectOption> | null;
    start_icon?: LayoutIcon | null;
    end_icon?: LayoutIcon | null;
    disabled?: boolean;
    required?: boolean;
    label?: string | null;
    helper_text?: string | null;
    size?: "small" | "medium" | null;
    placeholder?: string | null;
}

export interface LayoutSelectOption extends StrapiComponent {
    label: string;
    value: string;
}

export interface LayoutForm extends StrapiComponent {
    inputs: Array<LayoutFormInput>;
    action: string;
    method: "post" | "get" | "put" | "delete";
}

export interface SectionsContactSection extends StrapiComponent {
    link_to_page?: LayoutLink | null;
    contact_form: LayoutForm;
}

export interface BlogHero extends StrapiComponent {
    body: Array<JsonRichText>;
    cover_image: ImageComponent;
    link_to_page: LayoutLink;
    highlighted_text_color?: TextColors | null;
}

export interface BlogText extends StrapiComponent {
    body: Array<JsonRichText>;
    font_size: string | null;
    line_height: number | null;
    color: string | null;
    text_align?: "left" | "center" | "right" | null;
    highlighted_text_color?: TextColors | null;
}

export type TextColors =
    | "primary"
    | "secondary"
    | "warning"
    | "info"
    | "error"
    | "success"
    | "inherit";
