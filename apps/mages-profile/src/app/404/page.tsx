import { StatusErrorPage } from "@/components/errors/StatusErrorPage";
import { logData } from "@repo/shared-utils/log-data";

export default function NotFoundPage() {
    logData({
        title: "Error page rendered",
        type: "warn",
        layer: "*",
        timeStamp: true,
        data: {
            statusCode: 404,
            description: "Not found page displayed to the user.",
        },
    });

    return (
        <StatusErrorPage
            statusCode={404}
            title="Page Not Found"
            description="The content you requested does not exist or has been moved. Use the button below to return to a safe starting point."
            accentColor="#0F3057"
            accentSoftColor="#DAE6F4"
            backgroundTop="#E8EEF6"
            backgroundBottom="#BFD1E5"
            details="No internal details are exposed for this route."
        />
    );
}
