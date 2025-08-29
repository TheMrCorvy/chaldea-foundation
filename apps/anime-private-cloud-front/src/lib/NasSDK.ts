import { ServeEpisodeRequest, ServeEpisodeResponse } from "@/types/NasSDK";

export default class NasSDK {
    public serveEpisode(req: ServeEpisodeRequest) {
        return Promise.resolve({} as ServeEpisodeResponse);
    }
}
