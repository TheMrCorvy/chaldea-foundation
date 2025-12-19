export enum WebRoutes {
    HOME = "/",
    LOGIN = "/login",
    REGISTER = "/register",
    SEARCH = "/search",
    DIRECTORY = "/directory",
    EPISODE = "/episode",
    PENDING_USER_ACTIVATION = "/pending-activation",
    NOT_FOUND = "/404",
}

export enum ApiRoutes {
    MOCK_SESSION = "/api/set-mock-session",
    STREAM_EPISODE = "/api/stream-episode",
}

export enum NasApiRoutes {
    STREAM_MEDIA = "/api/v1/serve-episode",
    V2_STREAM_MEDIA = "/api/v2/stream",
    VIDEO_ONLY = "/api/v2/stream/video-only",
    AUDIO_ONLY = "/api/v2/stream/audio-only",
}
