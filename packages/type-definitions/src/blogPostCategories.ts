import { Pagination } from "./dynamicPage";

export interface BlogPostCategory {
    name: string;
    id: number;
    documentId: string;
    type_of_category: "blog_post" | "explicit_content" | "media_content"; // used to separate explicit content tags from normal tags in unlimited blades work
}

export type BlogPostCategoryResponse = {
    data?: Array<BlogPostCategory>;
    meta?: {
        pagination: Pagination;
    };
};
