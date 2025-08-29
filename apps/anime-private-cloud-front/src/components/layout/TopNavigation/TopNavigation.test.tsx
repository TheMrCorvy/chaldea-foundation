import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import TopNavigation from "./index";
import { navbarItemsTest } from "@/mocks/topNavigationItems";

describe("TopNavigation", () => {
    it("should render properly", () => {
        render(<TopNavigation navbarSections={navbarItemsTest} />);

        const navbar = screen.queryByTestId("top-navigation-component");

        expect(navbar).toBeInTheDocument();
    });

    it("should render all the links properly", () => {
        render(<TopNavigation navbarSections={navbarItemsTest} />);

        const firstLink = screen.getByText(navbarItemsTest[0].items[0].label);
        expect(firstLink).toBeInTheDocument();

        const lastItemsArr = navbarItemsTest[navbarItemsTest.length - 1].items;
        const lastItem = lastItemsArr[lastItemsArr.length - 1];
        const lastLink = screen.getByText(lastItem.label);
        expect(lastLink).toBeInTheDocument();
    });
});
