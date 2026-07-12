import { Pagination } from "./dynamicPage";

export interface BlogPostCategory {
    name: string;
    id: number;
    documentId: string;
    type_of_category: TagType; // used to separate explicit content tags from normal tags in unlimited blades work
}

export type TagType = "explicit_content" | "media_content" | "blog_post";

export type BlogPostCategoryResponse = {
    data?: Array<BlogPostCategory>;
    meta?: {
        pagination: Pagination;
    };
};
