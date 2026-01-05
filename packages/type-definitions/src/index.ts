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
    [key: string]: unknown;
}

type QueryFiltersRecord = Partial<
    Record<
        keyof Directory | keyof Episode | keyof ExtraKeysForQueryParams,
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
    path: string;
    createdAt: Date;
    updatedAt: Date;
    adult: boolean | "0" | "1" | "t" | "true" | "f" | "false";
    parent_directory?: Directory;
    documentId: string;
    publishedAt: string;
}

export interface Episode {
    id: number;
    display_name: string;
    createdAt: Date;
    updatedAt: Date;
    parent_directory?: Directory;
    documentId: string;
    version: "V1" | "V2";
    languages_info: LanguagesInfo;
    watched_by: {
        data: string[];
    } | null;
    publishedAt: string;
    file_type: string;
}

export interface StreamTracks {
    channels?: number;
    codec: string;
    globalIndex: number;
    trackIndex: number;
    language: string;
}

export interface LanguagesInfo {
    duration: number;
    extractedAt: Date;
    audioTracks: StreamTracks[];
    subtitleTracks: StreamTracks[];
}

export interface RequestDirectory {
    id?: number;
    display_name?: string;
    path?: string;
    createdAt?: Date;
    updatedAt?: Date;
    adult?: boolean | "0" | "1" | "t" | "true" | "f" | "false";
    parent_directory?: string;
    documentId?: string;
    publishedAt?: string;
}

export interface RequestEpisode {
    id?: number;
    display_name?: string;
    createdAt?: Date;
    updatedAt?: Date;
    parent_directory?: string;
    documentId?: string;
    version: "V1" | "V2";
    languages_info?: object;
    watched_by?: User[];
}
