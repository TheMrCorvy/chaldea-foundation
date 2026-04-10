import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "@mui/material/Button";
import { StatusErrorPage } from "./StatusErrorPage";

const meta = {
    title: "Errors/StatusErrorPage",
    component: StatusErrorPage,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
    args: {
        statusCode: 404,
        title: "Page Not Found",
        description:
            "The content you requested does not exist or has been moved. Use the button below to return to a safe starting point.",
        accentColor: "#0F3057",
        accentSoftColor: "#DAE6F4",
        backgroundTop: "#E8EEF6",
        backgroundBottom: "#BFD1E5",
        details: "No internal details are exposed for this route.",
        primaryActionLabel: "Back to home",
        primaryActionHref: "/",
    },
    argTypes: {
        secondaryAction: {
            control: false,
        },
    },
} satisfies Meta<typeof StatusErrorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PaymentRequired402: Story = {
    args: {
        statusCode: 402,
        title: "Payment Required",
        description:
            "This action requires an active subscription. Sign in with an account that has billing permissions or contact support.",
        accentColor: "#E67E22",
        accentSoftColor: "#FDEBD0",
        backgroundTop: "#FFF5E6",
        backgroundBottom: "#F8D7A3",
        details:
            "Access to this protected area is unavailable until billing is resolved.",
    },
};

export const Forbidden403: Story = {
    args: {
        statusCode: 403,
        title: "Forbidden",
        description:
            "You do not have permission to access this section. Please verify your account role or request access from an administrator.",
        accentColor: "#A31621",
        accentSoftColor: "#F9DDE0",
        backgroundTop: "#FFF2F3",
        backgroundBottom: "#F2C8CD",
        details: "The request was denied due to permission rules.",
    },
};

export const NotFound404: Story = {
    args: {
        statusCode: 404,
        title: "Page Not Found",
        description:
            "The content you requested does not exist or has been moved. Use the button below to return to a safe starting point.",
        accentColor: "#0F3057",
        accentSoftColor: "#DAE6F4",
        backgroundTop: "#E8EEF6",
        backgroundBottom: "#BFD1E5",
        details: "No internal details are exposed for this route.",
    },
};

export const NotFound404WithReason: Story = {
    args: {
        statusCode: 404,
        title: "Page Not Found",
        description:
            "The resource is unavailable. You can continue safely from the home page.",
        accentColor: "#0F3057",
        accentSoftColor: "#DAE6F4",
        backgroundTop: "#E8EEF6",
        backgroundBottom: "#BFD1E5",
        details: "Reference: missing-profile-slug",
    },
};

export const InternalServerError500: Story = {
    args: {
        statusCode: 500,
        title: "Internal Server Error",
        description:
            "Something went wrong while processing your request. Our team has been notified and is working on it.",
        accentColor: "#616161",
        accentSoftColor: "#ECECEC",
        backgroundTop: "#FAFAFA",
        backgroundBottom: "#D9D9D9",
        details: "Please try again in a few moments.",
    },
};

export const WithSecondarySupportAction: Story = {
    args: {
        statusCode: 403,
        title: "Forbidden",
        description:
            "You do not have permission to access this section. Please verify your account role or request access from an administrator.",
        accentColor: "#A31621",
        accentSoftColor: "#F9DDE0",
        backgroundTop: "#FFF2F3",
        backgroundBottom: "#F2C8CD",
        details: "The request was denied due to permission rules.",
        secondaryAction: (
            <Button
                variant="outlined"
                size="large"
                href="/support"
                sx={{
                    px: 3,
                    fontWeight: 700,
                    flex: { xs: "1 1 auto", sm: "0 0 auto" },
                }}
            >
                Contact support
            </Button>
        ),
    },
};
