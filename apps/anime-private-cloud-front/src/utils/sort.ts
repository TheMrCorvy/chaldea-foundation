import { AnimeEpisode, Directory } from "@/types/StrapiSDK";

export const sortAnimeEpisodes = (
    animeEpisodes: AnimeEpisode[]
): AnimeEpisode[] => {
    return animeEpisodes.sort((a, b) => {
        return a.display_name.localeCompare(b.display_name);
    });
};

export const sortDirectories = (directories: Directory[]): Directory[] => {
    return directories.sort((a, b) => {
        return a.display_name.localeCompare(b.display_name);
    });
};
