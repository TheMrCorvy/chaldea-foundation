import { printTimeStamp } from ".";
import { FeatureNames, isFeatureFlagEnabled } from "./featureFlags";

// Copy and paste these layers into LAYERS_AVAILABLE in the .env file to enable/disable the layers
type LayersAvailable =
    | "messages"
    | "room_ws"
    | "participants_update"
    | "camera"
    | "camera_caller"
    | "camera_receiver"
    | "screen_sharing"
    | "screen_sharing_sender"
    | "screen_sharing_receiver"
    | "access_user_hardware"
    | "poll"
    | "*"; // This layer will always be logged, use it for heavy errors

export interface LogDataParams {
    title?: string;
    data?: unknown;
    type?: "log" | "error" | "warn" | "info";
    clearConsole?: boolean;
    timeStamp?: boolean;
    addSpaceBefore?: boolean;
    addSpaceAfter?: boolean;
    layer?: LayersAvailable; // "layer" as the name implies is the layer where a certain console.log will be printed, so that all the app can have lots of console.logs but not all of them will alwaysshow up
    addSeparatorBefore?: boolean;
    addSeparatorAfter?: boolean;
}

export type LogData = (params: LogDataParams) => void;

export const logData: LogData = ({
    title,
    data,
    type = "log",
    clearConsole = false,
    timeStamp = false,
    layer,
    addSpaceBefore = false,
    addSpaceAfter = false,
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

    if (
        layer !== undefined &&
        layersAvailable.includes(layer) &&
        allowSpecificLayer
    ) {
        logIsAvailable = true;
        // If the layer is set and the feature flag is allowing for specific layers, then the logs are available
    }

    if (allowAllLogs || layer === "*") {
        logIsAvailable = true;
        // If layer is unset, the the developer has to set the FF CONSOLE_LOG_ALL_LAYERS in order to see any logs
    }

    if (!logIsAvailable) {
        return;
    }

    try {
        dataString = JSON.stringify({ data });
    } catch (err) {
        if (logIsAvailable) {
            console.warn("The data provided was corrupted or circular.", err);
        }
        dataString = data;
    }

    if (clearConsole) {
        console.clear();
    }

    logSpace(addSpaceBefore);

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
