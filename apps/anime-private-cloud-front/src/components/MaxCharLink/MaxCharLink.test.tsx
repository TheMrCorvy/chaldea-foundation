import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MaxCharLink from "./index";

describe("DirectoriesSidebar", () => {
    it("should render properly", () => {
        render(<MaxCharLink url="http://google.com" label="test" />);

        const link = screen.queryByTestId("max-char-link-complete");

        expect(link).toBeInTheDocument();
    });

    it("should render properly when label exceeds max character count", () => {
        render(
            <MaxCharLink
                url="http://google.com"
                label="testing if the component renders fine"
                maxLength={10}
            />
        );

        const link = screen.queryByTestId("max-char-link-truncated");

        expect(link).toBeInTheDocument();
    });
});
