import { render, screen, fireEvent } from "@testing-library/react";
import type { BlogPostCategory } from "@repo/type-definitions";
import TagFilterBar from ".";

const mockPush = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
        refresh: jest.fn(),
    }),
    usePathname: () => "/directory/test",
    useSearchParams: () => mockSearchParams,
}));

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
    beforeEach(() => {
        mockPush.mockClear();
        mockSearchParams = new URLSearchParams();
    });

    it("renders all tags", () => {
        render(<TagFilterBar tags={mockTags} />);

        expect(screen.getByText("anime")).toBeInTheDocument();
        expect(screen.getByText("acción")).toBeInTheDocument();
        expect(screen.getByText("comedia")).toBeInTheDocument();
    });

    it("renders nothing when tags array is empty", () => {
        const { container } = render(<TagFilterBar tags={[]} />);

        expect(container.firstChild).toBeNull();
    });

    it("navigates with updated search params when a tag is clicked", () => {
        render(<TagFilterBar tags={mockTags} />);

        fireEvent.click(screen.getByRole("button", { name: /anime/i }));

        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith(
            expect.stringContaining("tags=anime")
        );
    });

    it("does not show the clear button when no tags are selected", () => {
        render(<TagFilterBar tags={mockTags} />);

        expect(screen.queryByText("Limpiar")).not.toBeInTheDocument();
    });

    it("shows the clear button and handles click when tags are selected", () => {
        mockSearchParams = new URLSearchParams("tags=anime");

        render(<TagFilterBar tags={mockTags} />);

        const clearBtn = screen.getByRole("button", { name: /limpiar/i });
        expect(clearBtn).toBeInTheDocument();

        fireEvent.click(clearBtn);

        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(mockPush).toHaveBeenCalledWith("/directory/test?page=1");
    });
});
