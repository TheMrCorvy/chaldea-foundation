import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import DirectoryListItem from "./index";

describe("DirectoryListItem", () => {
    it("should render properly", () => {
        render(
            <DirectoryListItem
                displayName="Testing directory list item"
                directoryId={"2"}
            />
        );

        const directory = screen.queryByTestId("test-directory-list-item");
        expect(directory).toBeInTheDocument();
    });

    it("should render with isAdultProperty", () => {
        render(
            <DirectoryListItem
                displayName="Testing directory list item"
                directoryId={"2"}
                isAdult
            />
        );

        const directory = screen.queryByTestId("test-directory-list-item");
        expect(directory).toBeInTheDocument();

        const warning = screen.queryByTestId(
            "test-directory-list-item-warning"
        );
        expect(warning).toBeInTheDocument();
    });
});
