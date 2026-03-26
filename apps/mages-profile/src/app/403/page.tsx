import { StatusErrorPage } from "@/components/errors/StatusErrorPage";
import { logData } from "@repo/shared-utils/log-data";

export default function ForbiddenPage() {
    logData({
        title: "Error page rendered",
        type: "warn",
        layer: "*",
        timeStamp: true,
        data: {
            statusCode: 403,
            description: "Forbidden page displayed to the user.",
        },
    });

    return (
        <StatusErrorPage
            statusCode={403}
            title="Forbidden"
            description="You do not have permission to access this section. Please verify your account role or request access from an administrator."
            accentColor="#A31621"
            accentSoftColor="#F9DDE0"
            backgroundTop="#FFF2F3"
            backgroundBottom="#F2C8CD"
            details="The request was denied due to permission rules."
        />
    );
}
