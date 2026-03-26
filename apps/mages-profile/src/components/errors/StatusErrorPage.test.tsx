import Button from "@mui/material/Button";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { StatusErrorPage } from "./StatusErrorPage";

interface MockButtonProps {
    children?: ReactNode;
    href?: string;
}

jest.mock("@mui/material/Button", () => {
    return {
        __esModule: true,
        default: ({ children, href }: MockButtonProps) => {
            if (href) {
                return <a href={href}>{children}</a>;
            }

            return <button type="button">{children}</button>;
        },
    };
});

jest.mock("@mui/material/Box", () => {
    return {
        __esModule: true,
        default: ({ children }: { children?: React.ReactNode }) => (
            <div>{children}</div>
        ),
    };
});

jest.mock("@mui/material/Container", () => {
    return {
        __esModule: true,
        default: ({ children }: { children?: React.ReactNode }) => (
            <div>{children}</div>
        ),
    };
});

jest.mock("@mui/material/Paper", () => {
    return {
        __esModule: true,
        default: ({ children }: { children?: React.ReactNode }) => (
            <section>{children}</section>
        ),
    };
});

jest.mock("@mui/material/Stack", () => {
    return {
        __esModule: true,
        default: ({ children }: { children?: React.ReactNode }) => (
            <div>{children}</div>
        ),
    };
});

jest.mock("@mui/material/Chip", () => {
    return {
        __esModule: true,
        default: ({ label }: { label: React.ReactNode }) => (
            <span>{label}</span>
        ),
    };
});

jest.mock("@mui/material/Typography", () => {
    return {
        __esModule: true,
        default: ({
            children,
            variant,
        }: {
            children?: React.ReactNode;
            variant?: string;
        }) => {
            if (variant === "h2") {
                return <h2>{children}</h2>;
            }

            if (variant === "h4") {
                return <h4>{children}</h4>;
            }

            return <p>{children}</p>;
        },
    };
});

describe("StatusErrorPage", () => {
    const baseProps = {
        statusCode: 404,
        title: "Page Not Found",
        description:
            "The content you requested does not exist or has been moved.",
        accentColor: "#0F3057",
        accentSoftColor: "#DAE6F4",
        backgroundTop: "#E8EEF6",
        backgroundBottom: "#BFD1E5",
    };

    it("renders status code, title, description, and default primary action", () => {
        render(<StatusErrorPage {...baseProps} />);

        expect(screen.getByText("Error 404")).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "404" })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "Page Not Found" })
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "The content you requested does not exist or has been moved."
            )
        ).toBeInTheDocument();

        const primaryAction = screen.getByRole("link", {
            name: "Back to home",
        });

        expect(primaryAction).toBeInTheDocument();
        expect(primaryAction).toHaveAttribute("href", "/");
    });

    it("renders details when provided", () => {
        render(
            <StatusErrorPage
                {...baseProps}
                details="Reference: missing-profile-slug"
            />
        );

        expect(
            screen.getByText("Reference: missing-profile-slug")
        ).toBeInTheDocument();
    });

    it("does not render details block when details are not provided", () => {
        render(<StatusErrorPage {...baseProps} />);

        expect(
            screen.queryByText("Reference: missing-profile-slug")
        ).not.toBeInTheDocument();
    });

    it("renders custom primary action label and href", () => {
        render(
            <StatusErrorPage
                {...baseProps}
                primaryActionLabel="Retry"
                primaryActionHref="/retry"
            />
        );

        const primaryAction = screen.getByRole("link", { name: "Retry" });

        expect(primaryAction).toBeInTheDocument();
        expect(primaryAction).toHaveAttribute("href", "/retry");
    });

    it("renders secondary action when provided", () => {
        render(
            <StatusErrorPage
                {...baseProps}
                secondaryAction={
                    <Button href="/support" variant="outlined">
                        Contact support
                    </Button>
                }
            />
        );

        const secondaryAction = screen.getByRole("link", {
            name: "Contact support",
        });

        expect(secondaryAction).toBeInTheDocument();
        expect(secondaryAction).toHaveAttribute("href", "/support");
    });
});
