import { render, screen } from "@testing-library/react";
import { LayoutWorkExperienceListItem } from "@repo/type-definitions/dynamic-page";
import { ElementType, ReactNode } from "react";
import ExperienceListItem from "./index";

type MockMuiProps = {
    children?: ReactNode;
    component?: ElementType;
};

jest.mock("@mui/material", () => {
    const Box = ({ children, component: Component = "div" }: MockMuiProps) => (
        <Component>{children}</Component>
    );

    const Typography = ({
        children,
        component: Component = "span",
    }: MockMuiProps) => <Component>{children}</Component>;

    const Link = ({ children, component: Component = "a" }: MockMuiProps) => (
        <Component>{children}</Component>
    );

    const List = ({ children, component: Component = "ul" }: MockMuiProps) => (
        <Component>{children}</Component>
    );

    const ListItem = ({
        children,
        component: Component = "li",
    }: MockMuiProps) => <Component>{children}</Component>;

    return {
        Box,
        Typography,
        Link,
        List,
        ListItem,
    };
});

describe("ExperienceListItem", () => {
    it("renders experience details and formatted date range", () => {
        const experience: LayoutWorkExperienceListItem = {
            __component: "layout.work-experience-list-item",
            component_id: "experience-1",
            title: "Senior Frontend Engineer",
            orientation: "Remote",
            body: [
                {
                    type: "paragraph",
                    children: [
                        { type: "text", text: "Built scalable UI systems." },
                    ],
                },
            ],
            company: "Acme Corp",
            client: "Globex",
            location: "Lisbon",
            from: new Date("2024-01-01T00:00:00.000Z"),
            until: new Date("2024-12-01T00:00:00.000Z"),
        };

        render(<ExperienceListItem experience={experience} />);

        expect(
            screen.getByText("Senior Frontend Engineer")
        ).toBeInTheDocument();
        expect(screen.getByText("(Remote)")).toBeInTheDocument();
        expect(screen.getByText("Acme Corp / Globex")).toBeInTheDocument();
        expect(screen.getByText("Lisbon")).toBeInTheDocument();
        expect(screen.getByText("01/24 → 12/24")).toBeInTheDocument();
        expect(
            screen.getByText("Built scalable UI systems.")
        ).toBeInTheDocument();
    });

    it("does not render optional orientation and client when absent", () => {
        const experience: LayoutWorkExperienceListItem = {
            __component: "layout.work-experience-list-item",
            component_id: "experience-2",
            title: "Backend Engineer",
            body: [
                {
                    type: "paragraph",
                    children: [
                        { type: "text", text: "Improved API performance." },
                    ],
                },
            ],
            company: "Wayne Enterprises",
            location: "Gotham",
            from: new Date("2023-03-01T00:00:00.000Z"),
            until: new Date("2023-11-01T00:00:00.000Z"),
        };

        render(<ExperienceListItem experience={experience} />);

        expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
        expect(screen.queryByText(/\(.*\)/)).not.toBeInTheDocument();
        expect(screen.getByText(/^Wayne Enterprises\s*$/)).toBeInTheDocument();
        expect(screen.getByText("03/23 → 11/23")).toBeInTheDocument();
        expect(
            screen.getByText("Improved API performance.")
        ).toBeInTheDocument();
    });
});
