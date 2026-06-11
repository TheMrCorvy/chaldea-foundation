import "@salvatore.hakase/log-data";

declare module "@salvatore.hakase/log-data" {
    export interface LayersAvailable {
        strapi_service: "strapi_service";
        nas_service: "nas_service";
        nas_service_v2_audio: "nas_service_v2_audio";
        nas_disk_service: "nas_disk_service";
        auth_login: "auth_login";
        auth_logout: "auth_logout";
        auth_register: "auth_register";
        auth_middleware: "auth_middleware";
        auth_mock_session: "auth_mock_session";
        auth_register_token: "auth_register_token";
        nas_service_v2_video: "nas_service_v2_video";
        external_http_requests: "external_http_requests";
        internal_http_responses: "internal_http_responses";
        internal_http_requests: "internal_http_requests";
        external_http_responses: "external_http_responses";
        video_streaming: "video_streaming";
        video_streaming_subtitles: "video_streaming_subtitles";
        bug_report: "bug_report";
        webhooks_received: "webhooks_received";
        queue_jobs: "queue_jobs";
        client_access: "client_access";
    }
}
