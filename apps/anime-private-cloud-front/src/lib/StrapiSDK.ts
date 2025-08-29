import { notFoundResponse } from "@/mocks/mockedResponses";
import { HttpBase, HttpMethod } from "@/services/HttpBase";
import type {
    RegisterResponse,
    LoginResponse,
    MeResponse,
    ValidateRegisterTokenResponse,
    InvalidateRegisterTokenResponse,
    GetSingleDirectoryResponse,
    NotFoundResponse,
    GetDirectoriesResponse,
    GetAnimeEpisodesResponse,
    GetSingleAnimeEpisodeResponse,
    GetAllDirectoriesResponse,
    RegisterRequest,
    LoginRequest,
    MeRequest,
    ValidateRegisterTokenRequest,
    QueryParams,
    InvalidateRegisterTokenRequest,
    GetSingleDirectoryRequest,
    GetDirectoriesRequest,
    GetAnimeEpisodesRequest,
    GetAllDirectoriesRequest,
    Directory,
} from "@/types/StrapiSDK";
import { StrapiApiRoutes } from "@/utils/routes";
import QueryString from "qs";

interface BuildUrlString {
    url: string;
    params?: QueryParams;
    id?: string;
}

export default class StrapiSDK extends HttpBase {
    private buildUrlString(params: BuildUrlString) {
        const host = process.env.STRAPI_API_HOST as string;
        const baseUrl = `${host}${params.url}${params.id ? params.id : ""}`;

        if (!params) {
            return baseUrl;
        }

        const queryParams = QueryString.stringify(params.params);

        return baseUrl + `?${queryParams}`;
    }

    public async register(req: RegisterRequest): Promise<RegisterResponse> {
        const method = HttpMethod.POST;
        const url = StrapiApiRoutes.register;
        const uri = this.buildUrlString({ url, params: req.queryParams });

        return await this.executeRequest<RegisterResponse>({
            url: uri,
            method,
            body: req,
            header: req.headers,
            requestOperation: "register",
        });
    }

    public async login(req: LoginRequest): Promise<LoginResponse> {
        const method = HttpMethod.POST;
        const url = StrapiApiRoutes.login;
        const uri = this.buildUrlString({ url, params: req.queryParams });

        return await this.executeRequest<LoginResponse>({
            url: uri,
            method,
            body: req,
            header: req.headers,
            requestOperation: "login",
        });
    }

    public async me(req: MeRequest): Promise<MeResponse> {
        const method = HttpMethod.GET;
        const url = StrapiApiRoutes.me;
        const uri = this.buildUrlString({ url, params: req.queryParams });

        return await this.executeRequest<MeResponse>({
            url: uri,
            method,
            header: req.headers,
            requestOperation: "me",
            authToken: req.jwt,
        });
    }

    public async validateRegisterToken(
        req: ValidateRegisterTokenRequest
    ): Promise<ValidateRegisterTokenResponse> {
        const method = HttpMethod.GET;
        const url = StrapiApiRoutes.registerToken;
        const uri = this.buildUrlString({ url, params: req.queryParams });

        const tokenApiKey = process.env.STRAPI_REGISTER_TOKEN_API_KEY || "";

        if (!tokenApiKey) {
            throw new Error(
                "An error has ocurred: Register API key was not found"
            );
        }

        return await this.executeRequest<ValidateRegisterTokenResponse>({
            url: uri,
            method,
            header: req.headers,
            requestOperation: "validateRegisterToken",
            authToken: tokenApiKey,
        });
    }

    public async invalidateRegisterToken(
        req: InvalidateRegisterTokenRequest
    ): Promise<InvalidateRegisterTokenResponse> {
        const method = HttpMethod.PUT;
        const url = StrapiApiRoutes.registerToken;
        const uri = this.buildUrlString({
            url,
            params: req.queryParams,
            id: req.tokenId,
        });

        const tokenApiKey = process.env.STRAPI_REGISTER_TOKEN_API_KEY || "";

        if (!tokenApiKey) {
            throw new Error(
                "An error has ocurred: Register API key was not found"
            );
        }

        return await this.executeRequest<InvalidateRegisterTokenResponse>({
            url: uri,
            method,
            body: JSON.stringify({
                data: {
                    used: true,
                },
            }),
            header: req.headers,
            requestOperation: "invalidateRegisterToken",
            authToken: tokenApiKey,
        });
    }

    public async getSingleDirectory(
        req: GetSingleDirectoryRequest
    ): Promise<GetSingleDirectoryResponse | NotFoundResponse> {
        const method = HttpMethod.GET;
        const url = StrapiApiRoutes.singleDirectory;
        const uri = this.buildUrlString({
            url,
            params: req.queryParams,
            id: req.id,
        });

        const response = await this.executeRequest<GetSingleDirectoryResponse>({
            url: uri,
            method,
            header: req.headers,
            requestOperation: "getSingleDirectory",
            authToken: req.jwt,
        });

        if (response.data !== null) {
            return response;
        }

        return notFoundResponse;
    }

    public async getDirectories(
        req: GetDirectoriesRequest
    ): Promise<GetDirectoriesResponse> {
        const method = HttpMethod.GET;
        const url = StrapiApiRoutes.directories;
        const uri = this.buildUrlString({ url, params: req.queryParams });

        return await this.executeRequest<GetDirectoriesResponse>({
            url: uri,
            method,
            header: req.headers,
            requestOperation: "getDirectories",
            authToken: req.jwt,
        });
    }

    public async getSingleAnimeEpisode(
        req: GetSingleDirectoryRequest
    ): Promise<GetSingleAnimeEpisodeResponse | NotFoundResponse> {
        const method = HttpMethod.GET;
        const url = StrapiApiRoutes.singleAnimeEpisode;
        const uri = this.buildUrlString({
            url,
            params: req.queryParams,
            id: req.id,
        });

        const response =
            await this.executeRequest<GetSingleAnimeEpisodeResponse>({
                url: uri,
                method,
                header: req.headers,
                requestOperation: "getSingleAnimeEpisode",
                authToken: req.jwt,
            });

        if (response.data !== null) {
            return response;
        }

        return notFoundResponse;
    }

    public async getAnimeEpisodes(
        req: GetAnimeEpisodesRequest
    ): Promise<GetAnimeEpisodesResponse> {
        const method = HttpMethod.GET;
        const url = StrapiApiRoutes.directories;
        const uri = this.buildUrlString({ url, params: req.queryParams });

        return await this.executeRequest<GetAnimeEpisodesResponse>({
            url: uri,
            method,
            header: req.headers,
            requestOperation: "getAnimeEpisodes",
            authToken: req.jwt,
        });
    }

    public async getAllDirectories(
        req: GetAllDirectoriesRequest
    ): Promise<GetAllDirectoriesResponse> {
        const method = HttpMethod.GET;
        const url = StrapiApiRoutes.allDirectories;
        const uri = this.buildUrlString({ url, params: req.queryParams });

        return await this.executeRequest<GetAllDirectoriesResponse>({
            url: uri,
            method,
            header: req.headers,
            requestOperation: "getAllDirectories",
            authToken: req.jwt,
        });
    }
}
