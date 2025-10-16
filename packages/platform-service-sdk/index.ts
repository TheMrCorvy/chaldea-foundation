import * as Real from "./generated-sdk";

import * as Mock from "./generated-mock-sdk";

let services;

if (process.env.CONSUME_STRAPI_DATA === "true") {
    services = {
        AnimeEpisodeService: Real.AnimeEpisodeService,
        AnimeService: Real.AnimeService,
        BookPageService: Real.BookPageService,
        BookService: Real.BookService,
        BubbleService: Real.BubbleService,
        ContentTypeBuilderService: Real.ContentTypeBuilderService,
        DirectoryService: Real.DirectoryService,
        EventService: Real.EventService,
        FranchiseService: Real.FranchiseService,
        I18NService: Real.I18NService,
        JurisdictionService: Real.JurisdictionService,
        RegisterTokenService: Real.RegisterTokenService,
        SharedMediaService: Real.SharedMediaService,
        TimeLineService: Real.TimeLineService,
        UploadService: Real.UploadService,
        UsersPermissionsService: Real.UsersPermissionsService,
        WorldService: Real.WorldService,
    };
} else {
    services = {
        AnimeEpisodeService: Mock.MockAnimeEpisodeService,
        AnimeService: Mock.MockAnimeService,
        BookPageService: Mock.MockBookPageService,
        BookService: Mock.MockBookService,
        BubbleService: Mock.MockBubbleService,
        ContentTypeBuilderService: Mock.MockContentTypeBuilderService,
        DirectoryService: Mock.MockDirectoryService,
        EventService: Mock.MockEventService,
        FranchiseService: Mock.MockFranchiseService,
        I18NService: Mock.MockI18NService,
        JurisdictionService: Mock.MockJurisdictionService,
        RegisterTokenService: Mock.MockRegisterTokenService,
        SharedMediaService: Mock.MockSharedMediaService,
        TimeLineService: Mock.MockTimeLineService,
        UploadService: Mock.MockUploadService,
        UsersPermissionsService: Mock.MockUsersPermissionsService,
        WorldService: Mock.MockWorldService,
    };
}

export const {
    AnimeEpisodeService,
    AnimeService,
    BookPageService,
    BookService,
    BubbleService,
    ContentTypeBuilderService,
    DirectoryService,
    EventService,
    FranchiseService,
    I18NService,
    JurisdictionService,
    RegisterTokenService,
    SharedMediaService,
    TimeLineService,
    UploadService,
    UsersPermissionsService,
    WorldService,
} = services;
