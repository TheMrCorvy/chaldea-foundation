import { BlogPostCategory } from "./blogPostCategories";

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
    use_server: boolean;
    categories?: Array<BlogPostCategory> | null;
}

export interface StrapiComponent {
    __component: string;
    component_id: string;
    title: string | null;
    id: number;
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
    | LayoutDescriptionWithChipsList
    | LayoutLogoLoop
    | BlogLastPosts
    | BlogReadingProgressBar
    | LayoutTitle
    | BlogSearchByCategory;

export interface DynamicPageSections {
    [key: string]: StrapiSection;
}

export interface Pagination {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

export type DynamicPageResponse = {
    data?: Array<DynamicPage>;
    meta?: {
        pagination: Pagination;
    };
};

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
    size: number;
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
    size?:
        | "body1"
        | "body2"
        | "button"
        | "caption"
        | "h1"
        | "h2"
        | "h3"
        | "h4"
        | "h5"
        | "h6"
        | "inherit"
        | "overline"
        | "subtitle1"
        | "subtitle2";
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
    rel?: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
}

export interface SectionsProjectsSection extends StrapiComponent {
    title_color?: string | null;
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
    logo_loop?: boolean | null;
    vertical_logo_loop?: boolean | null;
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

export interface LayoutLogoLoop extends StrapiComponent {
    chips: Array<LayoutToolChip>;
    vertical?: boolean | null;
    duration?: number | null;
    direction: "normal" | "reverse";
    gap?: string | null;
    title_color: string;
    text_align?: "left" | "center" | "right" | null;
}

export interface BlogLastPosts extends Omit<StrapiComponent, "title"> {
    link_to_page?: LayoutLink | null;
    posts_count: number;
    title: LayoutTitle;
    related_posts?: Array<LayoutToolChip> | null;
}

export interface BlogPost {
    documentId: string;
    title: string;
    slug: string;
    description?: string | null;
    cover_image?: {
        url: string;
        alt?: string | null;
    } | null;
}

export interface BlogReadingProgressBar extends Omit<StrapiComponent, "title"> {
    position: "top" | "bottom" | "right" | "left";
    reversed: boolean;
    color: "primary" | "secondary" | "warning" | "info" | "error" | "success";
    bar_thickness: string;
    title: LayoutTitle;
}

export interface LayoutTitle extends StrapiComponent {
    color: string;
    size: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    text_align: "left" | "center" | "right";
    link_icon_color: TextColors;
    popuver?: string | null;
    animation_cycles: number;
    link_to_page?: LayoutLink | null;
}

export interface BlogSearchByCategory extends Omit<StrapiComponent, "title"> {
    title: LayoutTitle;
    posts_count: number;
}
