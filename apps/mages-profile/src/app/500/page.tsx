import { StatusErrorPage } from "@/components/errors/StatusErrorPage";
import { logData } from "@salvatore.hakase/log-data";

export default function InternalServerErrorPage() {
    const logType = process.env.NODE_ENV === "production" ? "error" : "warn";

    logData({
        title: "Error page rendered",
        type: logType,
        layer: "*",
        timeStamp: true,
        data: {
            statusCode: 500,
            description: "Internal server error page displayed to the user.",
        },
    });

    return (
        <StatusErrorPage
            statusCode={500}
            title="Internal Server Error"
            description="Something went wrong while processing your request. Our team has been notified and is working on it."
            accentColor="#616161"
            accentSoftColor="#ECECEC"
            backgroundTop="#FAFAFA"
            backgroundBottom="#D9D9D9"
            details="Please try again in a few moments."
        />
    );
}
