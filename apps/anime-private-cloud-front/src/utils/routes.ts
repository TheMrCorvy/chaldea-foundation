export enum WebRoutes {
    home = "/",
    login = "/login/",
    register = "/register/",
    search = "/search/",
    directory = "/directory/",
    animeEpisode = "/anime-episode/",
    pendingUserActivation = "/pending-activation/",
    animesWatched = "/animes-watched/",
}

export enum ApiRoutes {
    mockSession = "/api/set-mock-session/",
    streamAnimeEpisode = "/api/stream-anime-episode/",
}

export enum StrapiApiRoutes {
    register = "/api/auth/local/register/",
    login = "/api/auth/local/",
    me = "/api/users/me/",
    registerToken = "/api/register-tokens/",
    singleAnimeEpisode = "/api/anime-episodes/",
    animeEpisodes = "/api/anime-episodes/",
    singleDirectory = "/api/directories/",
    directories = "/api/directories/",
    allDirectories = "/api/directories/all/",
    allAnimeEpisodes = "/api/anime-episodes/all/",
}

export enum NasApiRoutes {
    serveAnimeEpisode = "/api/serve-anime-episode/",
}
