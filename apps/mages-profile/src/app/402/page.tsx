import { StatusErrorPage } from "@/components/errors/StatusErrorPage";
import { logData } from "@repo/shared-utils/log-data";

export default function PaymentRequiredPage() {
    logData({
        title: "Error page rendered",
        type: "warn",
        layer: "*",
        timeStamp: true,
        data: {
            statusCode: 402,
            description: "Payment required page displayed to the user.",
        },
    });

    return (
        <StatusErrorPage
            statusCode={402}
            title="Payment Required"
            description="This action requires an active subscription. Sign in with an account that has billing permissions or contact support."
            accentColor="#E67E22"
            accentSoftColor="#FDEBD0"
            backgroundTop="#FFF5E6"
            backgroundBottom="#F8D7A3"
            details="Access to this protected area is unavailable until billing is resolved."
        />
    );
}
