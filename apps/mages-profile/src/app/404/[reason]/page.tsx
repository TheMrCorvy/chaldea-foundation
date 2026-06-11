import { StatusErrorPage } from "@/components/errors/StatusErrorPage";
import { logData } from "@salvatore.hakase/log-data";

interface NotFoundReasonPageProps {
    params: Promise<{
        reason: string;
    }>;
}

export default async function NotFoundReasonPage({
    params,
}: NotFoundReasonPageProps) {
    const { reason } = await params;

    logData({
        title: "Error page rendered",
        type: "warn",
        layer: "*",
        timeStamp: true,
        data: {
            statusCode: 404,
            description: "Not found page rendered with reason identifier.",
            reason,
        },
    });

    return (
        <StatusErrorPage
            statusCode={404}
            title="Page Not Found"
            description="The resource is unavailable. You can continue safely from the home page."
            accentColor="#0F3057"
            accentSoftColor="#DAE6F4"
            backgroundTop="#E8EEF6"
            backgroundBottom="#BFD1E5"
            details={`Reference: ${reason}`}
        />
    );
}
