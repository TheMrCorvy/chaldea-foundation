import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { BlogPostCategory } from "@repo/type-definitions";
import TagFilterBar from ".";

const mockTags: BlogPostCategory[] = [
    {
        id: 1,
        name: "anime",
        documentId: "t1",
        type_of_category: "media_content",
    },
    {
        id: 2,
        name: "acción",
        documentId: "t2",
        type_of_category: "media_content",
    },
    {
        id: 3,
        name: "comedia",
        documentId: "t3",
        type_of_category: "media_content",
    },
];

describe("TagFilterBar", () => {
    it("renders all tags", () => {
        render(
            <TagFilterBar
                tags={mockTags}
                selectedTagIds={[]}
                onTagToggle={jest.fn()}
                onClearAll={jest.fn()}
            />
        );

        expect(screen.getByText("anime")).toBeInTheDocument();
        expect(screen.getByText("acción")).toBeInTheDocument();
        expect(screen.getByText("comedia")).toBeInTheDocument();
    });

    it("renders nothing when tags array is empty", () => {
        const { container } = render(
            <TagFilterBar
                tags={[]}
                selectedTagIds={[]}
                onTagToggle={jest.fn()}
                onClearAll={jest.fn()}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it("calls onTagToggle with the correct tag id when a tag is clicked", async () => {
        const onTagToggle = jest.fn();

        render(
            <TagFilterBar
                tags={mockTags}
                selectedTagIds={[]}
                onTagToggle={onTagToggle}
                onClearAll={jest.fn()}
            />
        );

        await userEvent.click(screen.getByRole("button", { name: /acción/i }));

        expect(onTagToggle).toHaveBeenCalledTimes(1);
        expect(onTagToggle).toHaveBeenCalledWith(2);
    });

    it("does not show the clear button when no tags are selected", () => {
        render(
            <TagFilterBar
                tags={mockTags}
                selectedTagIds={[]}
                onTagToggle={jest.fn()}
                onClearAll={jest.fn()}
            />
        );

        expect(screen.queryByText("Limpiar")).not.toBeInTheDocument();
    });

    it("shows the clear button when at least one tag is selected", () => {
        render(
            <TagFilterBar
                tags={mockTags}
                selectedTagIds={[1]}
                onTagToggle={jest.fn()}
                onClearAll={jest.fn()}
            />
        );

        expect(screen.getByText("Limpiar")).toBeInTheDocument();
    });

    it("calls onClearAll when the clear button is clicked", async () => {
        const onClearAll = jest.fn();

        render(
            <TagFilterBar
                tags={mockTags}
                selectedTagIds={[1, 3]}
                onTagToggle={jest.fn()}
                onClearAll={onClearAll}
            />
        );

        await userEvent.click(screen.getByRole("button", { name: /limpiar/i }));

        expect(onClearAll).toHaveBeenCalledTimes(1);
    });
});
