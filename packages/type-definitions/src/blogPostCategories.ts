import { Pagination } from "./dynamicPage";

export interface BlogPostCategory {
    name: string;
    id: number;
    documentId: string;
}

export type BlogPostCategoryResponse = {
    data?: Array<BlogPostCategory>;
    meta?: {
        pagination: Pagination;
    };
};
