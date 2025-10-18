export interface PaginationQuery {
    page?: number;
    pageSize?: number;
}

export interface PaginationObject {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

interface QueryObject {
    [key: string]: string | string[] | QueryObject;
}

type Equal = string | boolean | number | null;
type NotEqual = string | boolean | number | null;
type LessThan = number;
type LessThanOrEqual = number;
type GreaterThan = number;
type GreaterThanOrEqual = number;
type IncludedIn = string[];
type NotIncludedIn = string[];
type Contains = string;
type NotContains = string;
type Null = boolean;
type NotNull = boolean;
type Between = string[] | number[];
type StartsWith = string;
type EndsWith = string;
type And = QueryObject[];
type Not = QueryObject[];
type Or = QueryObject[];

export interface QueryFilters {
    $and?: And;
    $or?: Or;
    $not?: Not;
    $eq?: Equal;
    $ne?: NotEqual;
    $in?: IncludedIn;
    $notIn?: NotIncludedIn;
    $lt?: LessThan;
    $lte?: LessThanOrEqual;
    $gt?: GreaterThan;
    $gte?: GreaterThanOrEqual;
    $between?: Between;
    $contains?: Contains;
    $notContains?: NotContains;
    $startsWith?: StartsWith;
    $endsWith?: EndsWith;
    $null?: Null;
    $notNull?: NotNull;
}

type QueryFiltersRecord = Partial<
    Record<
        keyof Directory | keyof AnimeEpisode | keyof ExtraKeysForQueryParams,
        QueryFilters
    >
>;

interface ExtraKeysForQueryParams {
    token: string;
    name: string;
    type: RoleTypes | string;
    email: string;
    username: string;
    id: number | string;
    provider: string;
    blocked: boolean;
    confirmed: boolean;
    used: null | boolean;
}

export interface QueryParams {
    populate?: string | string[] | QueryObject;
    fields?: string | string[];
    sort?: string[];
    filters?: QueryFiltersRecord;
    pagination?: PaginationQuery;
    publicationState?: string;
    locale?: string | string[];
}

/** Strapi Entities */
export enum RoleTypes {
    ADULT_ANIME_WATCHER = "adult_anime_watcher",
    ANIME_WATCHER = "anime_watcher",
    ANIME_PAGE_ADMIN = "anime_page_admin",
}

export interface Role {
    createdAt: Date;
    id: number;
    name: string;
    updatedAt: Date;
    type: RoleTypes | string;
    description: string;
}

export interface User {
    createdAt: Date;
    updatedAt: Date;
    email: string;
    username: string;
    id: number;
    provider: string;
    blocked: boolean;
    confirmed: boolean;
    role?: Role;
}

export interface Directory {
    id: number;
    display_name: string;
    directory_path: string;
    createdAt: Date;
    updatedAt: Date;
    adult: boolean;
    parent_directory?: Directory | null;
    sub_directories?: Directory[];
    documentId: string;
    anime_episodes?: AnimeEpisode[];
}

export interface AnimeEpisode {
    id: number;
    display_name: string;
    file_path: string;
    createdAt: Date;
    updatedAt: Date;
    parent_directory?: Directory;
    documentId: string;
}
