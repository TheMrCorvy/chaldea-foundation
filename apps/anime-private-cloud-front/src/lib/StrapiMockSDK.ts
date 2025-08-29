import {
    mockAnimeEpisodes,
    mockAnimeEpisodesResponse,
    mockDirectories,
    mockLoginResponse,
    mockMeResponse,
    mockRegisterResponse,
    notFoundResponse,
    registerTokens,
} from "@/mocks/mockedResponses";
import { FeatureNames } from "@/services/featureFlagService";
import { HttpMethod } from "@/services/HttpBase";
import type {
    Register,
    StrapiSDK,
    Login,
    Me,
    ValidateRegisterTokenResponse,
    ValidateRegisterToken,
    InvalidateRegisterToken,
    InvalidateRegisterTokenResponse,
    GetSingleAnimeEpisode,
    GetSingleDirectory,
    GetAnimeEpisodes,
    GetAnimeEpisodesResponse,
    GetDirectories,
    GetDirectoriesResponse,
    GetSingleDirectoryResponse,
    GetAllDirectories,
    GetAllDirectoriesResponse,
    NotFoundResponse,
} from "@/types/StrapiSDK";
import logData from "@/utils/logData";
import { StrapiApiRoutes } from "@/utils/routes";
import QueryString from "qs";

const host = process.env.STRAPI_API_HOST as string;

const register: Register = async (req) => {
    const method = HttpMethod.POST;
    const url = StrapiApiRoutes.register;
    const queryParams = req.queryParams
        ? QueryString.stringify(req.queryParams)
        : "";

    const uri = `${host}${url}?${queryParams}`;

    logData({
        data: {
            uri,
            method,
        },
        ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
        title: "register",
    });

    return await Promise.resolve(mockRegisterResponse);
};

const login: Login = async (req) => {
    const method = HttpMethod.POST;
    const url = StrapiApiRoutes.login;
    const queryParams = req.queryParams
        ? QueryString.stringify(req.queryParams)
        : "";

    const uri = `${host}${url}?${queryParams}`;

    logData({
        data: {
            uri,
            method,
        },
        ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
        title: "login",
    });

    return await Promise.resolve(mockLoginResponse);
};

const me: Me = async (req) => {
    const method = HttpMethod.GET;
    const url = StrapiApiRoutes.me;
    const queryParams = req.queryParams
        ? QueryString.stringify(req.queryParams)
        : "";

    const uri = `${host}${url}?${queryParams}`;

    logData({
        data: {
            uri,
            method,
        },
        ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
        title: "me",
    });

    return await Promise.resolve(mockMeResponse);
};

const validateRegisterToken: ValidateRegisterToken = async (req) => {
    const method = HttpMethod.GET;
    const url = StrapiApiRoutes.registerToken;
    const queryParams = req.queryParams
        ? QueryString.stringify(req.queryParams)
        : "";

    const uri = `${host}${url}?${queryParams}`;

    logData({
        data: {
            uri,
            method,
        },
        ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
        title: "validateRegisterToken",
    });

    let response: ValidateRegisterTokenResponse;

    const mockedResponse = registerTokens[req.token] as
        | ValidateRegisterTokenResponse
        | undefined;

    if (mockedResponse !== undefined) {
        response = mockedResponse;
    } else {
        response = registerTokens["404"] as ValidateRegisterTokenResponse;
    }

    return (await Promise.resolve(response)) as ValidateRegisterTokenResponse;
};

const invalidateRegisterToken: InvalidateRegisterToken = async (req) => {
    const method = "PUT";
    const url = StrapiApiRoutes.registerToken;
    const queryParams = req.queryParams
        ? QueryString.stringify(req.queryParams)
        : "";

    const uri = `${host}${url}?${queryParams}`;

    logData({
        data: {
            uri,
            method,
        },
        ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
        title: "invalidateRegisterToken",
    });

    let response: ValidateRegisterTokenResponse;

    const mockedResponse = registerTokens[req.tokenId.toString()] as
        | ValidateRegisterTokenResponse
        | undefined;

    if (mockedResponse !== undefined) {
        response = mockedResponse;
    } else {
        response = registerTokens["404"] as ValidateRegisterTokenResponse;
    }

    return (await Promise.resolve(response)) as InvalidateRegisterTokenResponse;
};

const getSingleAnimeEpisode: GetSingleAnimeEpisode = async (req) => {
    const method = HttpMethod.GET;
    const url = StrapiApiRoutes.singleAnimeEpisode;
    const queryParams = req.queryParams
        ? QueryString.stringify(req.queryParams)
        : "";

    const uri = `${host}${url}?${queryParams}`;

    logData({
        data: {
            uri,
            method,
        },
        ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
        title: "getSingleAnimeEpisode",
    });

    const index = parseInt(req.id) < 1 ? 0 : parseInt(req.id) - 1;

    const episodeFound = mockAnimeEpisodes[index];

    if (episodeFound) {
        return await Promise.resolve({
            data: episodeFound,
            ok: true,
            meta: {},
            status: 200,
        });
    }

    return await Promise.resolve({ ...notFoundResponse });
};

const getAnimeEpisodes: GetAnimeEpisodes = async (req) => {
    const method = HttpMethod.GET;
    const url = StrapiApiRoutes.animeEpisodes;
    const queryParams = req.queryParams
        ? QueryString.stringify(req.queryParams)
        : "";

    const uri = `${host}${url}?${queryParams}`;

    logData({
        data: {
            uri,
            method,
        },
        ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
        title: "getAnimeEpisodes",
    });

    return (await Promise.resolve({
        ok: true,
        meta: {},
        status: 200,
        data: mockAnimeEpisodes,
    })) as GetAnimeEpisodesResponse;
};

const getSingleDirectory: GetSingleDirectory = async (req) => {
    const method = HttpMethod.GET;
    const url = StrapiApiRoutes.singleDirectory;
    const queryParams = req.queryParams
        ? QueryString.stringify(req.queryParams)
        : "";

    const uri = `${host}${url}?${queryParams}`;

    logData({
        data: {
            uri,
            method,
        },
        ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
        title: "getSingleDirectory",
    });

    const directoryFound = mockDirectories.find(
        (directory) => req.id === directory.documentId
    );

    if (directoryFound) {
        return (await Promise.resolve({
            data: {
                ...directoryFound,
                anime_episodes: mockAnimeEpisodesResponse.filter(
                    (ep) =>
                        ep.parent_directory?.documentId ===
                        directoryFound.documentId
                ),
            },
            ok: true,
            meta: {},
            status: 200,
        })) as GetSingleDirectoryResponse;
    }

    return (await Promise.resolve({ ...notFoundResponse })) as NotFoundResponse;
};

const getDirectories: GetDirectories = async (req) => {
    const method = HttpMethod.GET;
    const url = StrapiApiRoutes.directories;
    const queryParams = req.queryParams
        ? QueryString.stringify(req.queryParams)
        : "";

    const uri = `${host}${url}?${queryParams}`;

    logData({
        data: {
            uri,
            method,
        },
        ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
        title: "getDirectories",
    });

    return (await Promise.resolve({
        ok: true,
        meta: {},
        status: 200,
        data: mockDirectories,
    })) as GetDirectoriesResponse;
};

const getAllDirectories: GetAllDirectories = async (req) => {
    const method = HttpMethod.GET;
    const url = StrapiApiRoutes.allDirectories;
    const queryParams = req.queryParams
        ? QueryString.stringify(req.queryParams)
        : "";

    const uri = `${host}${url}?${queryParams}`;

    logData({
        data: {
            uri,
            method,
        },
        ff: FeatureNames.LOG_EXTERNAL_HTTP_REQUESTS,
        title: "getAllDirectories",
    });

    return (await Promise.resolve({
        ok: true,
        meta: {},
        status: 200,
        data: mockDirectories,
    })) as GetAllDirectoriesResponse;
};

const StrapiMockSDK: StrapiSDK = {
    register,
    login,
    me,
    validateRegisterToken,
    invalidateRegisterToken,
    getDirectories,
    getSingleDirectory,
    getAnimeEpisodes,
    getSingleAnimeEpisode,
    getAllDirectories,
};

export default StrapiMockSDK;
