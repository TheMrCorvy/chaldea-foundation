import { printTimeStamp } from ".";
import { FeatureNames, isFeatureFlagEnabled } from "./featureFlags";

// Copy and paste these layers into LAYERS_AVAILABLE in the .env file to enable/disable the layers
type LayersAvailable =
    | "strapi_service"
    | "nas_service"
    | "nas_service_v2_video"
    | "nas_service_v2_audio"
    | "nas_disk_service"
    | "auth_login"
    | "auth_logout"
    | "auth_register"
    | "auth_middleware"
    | "auth_mock_session"
    | "auth_register_token"
    | "internal_http_requests"
    | "external_http_requests"
    | "internal_http_responses"
    | "external_http_responses"
    | "video_streaming"
    | "video_streaming_subtitles"
    | "bug_report"
    | "webhooks_received"
    | "queue_jobs"
    | "client_access"
    | "*"; // This layer will always be logged, use it for heavy errors

export interface LogDataParams {
    title?: string;
    data?: unknown;
    type?: "log" | "error" | "warn" | "info";
    clearConsole?: boolean;
    timeStamp?: boolean;
    addSpaceBefore?: boolean;
    addSpaceAfter?: boolean;
    layer?: LayersAvailable; // "layer" as the name implies is the layer where a certain console.log will be printed, so that all the app can have lots of console.logs but not all of them will always show up
    addSeparatorBefore?: boolean;
    addSeparatorAfter?: boolean;
}

export type LogData = (params: LogDataParams) => void;

export const logData: LogData = ({
    data,
    layer,
    title,
    type = "log",
    timeStamp = false,
    clearConsole = false,
    addSpaceAfter = false,
    addSpaceBefore = false,
    addSeparatorAfter = false,
    addSeparatorBefore = false,
}) => {
    const layersAvailable = JSON.parse(
        process.env.LAYERS_AVAILABLE || "[]"
    ) as string[];

    const allowAllLogs = isFeatureFlagEnabled(
        FeatureNames.CONSOLE_LOG_ALL_LAYERS
    );
    const allowSpecificLayer = isFeatureFlagEnabled(
        FeatureNames.CONSOLE_LOG_LAYER_SPECIFIC
    );
    let dataString: unknown;

    const logLabel = title ? `${title}${data ? ": " : ""}` : "Debug log: ";
    const separator =
        "- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -";

    let logIsAvailable = false;

    const appName = process.env.APP_NAME || "Unknown App";

    if (
        layer !== undefined &&
        layersAvailable.includes(layer) &&
        allowSpecificLayer
    ) {
        logIsAvailable = true;
        // If the layer is set and the FF is allowing for specific layers, then the logs are available
    }

    if (allowAllLogs || layer === "*") {
        logIsAvailable = true;
        // If layer is unset, the the developer has to set the FF CONSOLE_LOG_ALL_LAYERS in order to see any logs
    }

    if (!logIsAvailable) {
        return;
    }

    if (clearConsole) {
        console.clear();
    }

    logSpace(addSpaceBefore);

    try {
        dataString = JSON.stringify({ app: appName, payload: data });
    } catch (err) {
        if (logIsAvailable) {
            console.warn("The data provided was corrupted or circular.", err);
            logSpace(true);
        }

        dataString = { app: appName, payload: data };
    }

    if (addSeparatorBefore) {
        console.log(separator);
    }

    switch (type) {
        case "error":
            console.error(logLabel, data ? dataString : "");
            break;

        case "warn":
            console.warn(logLabel, data ? dataString : "");
            break;

        case "info":
            console.info(logLabel, data ? dataString : "");

            break;

        default:
            console.log(logLabel, data ? dataString : "");
            break;
    }

    if (timeStamp) {
        logSpace(addSpaceAfter);
        console.log(printTimeStamp());
        logSpace(addSpaceAfter);
    }

    if (addSeparatorAfter) {
        console.log(separator);
    }

    logSpace(addSpaceAfter);
};

const logSpace = (addSpaceAfter: boolean) => {
    if (addSpaceAfter) {
        console.log(" ");
    }
};
