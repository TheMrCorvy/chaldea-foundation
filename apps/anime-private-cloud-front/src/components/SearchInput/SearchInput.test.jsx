import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import SearchInput from "./";

describe("SearchInput", () => {
    it("should render properly", () => {
        render(<SearchInput />);

        const input = screen.queryByTestId("search-input");
        const searchSubmitBtn = screen.queryByTestId("search-submit-btn");

        expect(input).toBeInTheDocument();
        expect(searchSubmitBtn).toBeInTheDocument();
    });

    it("should allow the user to write on the input", () => {
        render(<SearchInput />);

        const input = screen.queryByTestId("search-input");

        fireEvent.change(input, { target: { value: "Hello world!" } });
        expect(input.value).toBe("Hello world!");
    });
});
