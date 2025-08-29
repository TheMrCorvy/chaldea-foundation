export interface Page {
    params: { slug: string; directoryId: string; animeEpisodeId: string };
    searchParams: { [key: string]: string | string[] | undefined };
}
