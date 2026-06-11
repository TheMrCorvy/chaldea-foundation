import { StatusErrorPage } from "@/components/errors/StatusErrorPage";
import { logData } from "@salvatore.hakase/log-data";

export default function NotFound() {
    logData({
        title: "Not found boundary rendered",
        type: "warn",
        layer: "*",
        timeStamp: true,
        data: {
            statusCode: 404,
            description: "Next.js not-found boundary rendered.",
        },
    });

    return (
        <StatusErrorPage
            statusCode={404}
            title="Page Not Found"
            description="This route does not exist. Return to the main page to continue browsing safely."
            accentColor="#0F3057"
            accentSoftColor="#DAE6F4"
            backgroundTop="#E8EEF6"
            backgroundBottom="#BFD1E5"
            details="The requested route could not be resolved."
        />
    );
}
