// Import all services from the REAL SDK
import * as Real from "./generated-sdk";

// Import all mock services from the MOCK SDK
import * as Mock from "./generated-mock-sdk";

// Re-export all the common types and core utilities from the real SDK.
// These are needed by the application regardless of which implementation is used.
// export * from "./generated-sdk";

// --- Conditional Service Export ---

let services;

// This check is the key. Bundlers like Vite and Next.js can use this
// to perform "tree-shaking" and remove the unused SDK from the final bundle.
if (process.env.CONSUME_STRAPI_DATA === "true") {
    console.log("🚀 Using REAL Strapi SDK");
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
    console.log(" MOCKING Strapi SDK");
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

// Export the conditionally chosen services
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
