import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MainContainer from "./index";
import MockedContent from "@/mocks/contentForContainer";

describe("MainContainer", () => {
    it("should render properly", () => {
        render(
            <MainContainer>
                <MockedContent />
            </MainContainer>
        );

        const container = screen.queryByTestId("main-container");

        expect(container).toBeInTheDocument();
    });

    it("should render inner components", () => {
        render(
            <MainContainer>
                <MockedContent amountOfItems={10} />
            </MainContainer>
        );

        const firstItem = screen.queryByTestId("mocked-content-0");
        const lastItem = screen.queryByTestId("mocked-content-9");

        expect(firstItem).toBeInTheDocument();
        expect(lastItem).toBeInTheDocument();
    });
});
