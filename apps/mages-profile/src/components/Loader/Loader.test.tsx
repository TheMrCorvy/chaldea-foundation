import { render } from "@testing-library/react";
import Loader from "./index";
import styles from "./Loader.module.css";

describe("Loader", () => {
    it("renders the loader root container with the expected class", () => {
        const { container } = render(<Loader />);

        const rootElement = container.firstElementChild;

        expect(rootElement).toBeInTheDocument();
        expect(rootElement).toHaveClass(styles.pl);
    });

    it("renders six dots and three layers inside each dot", () => {
        const { container } = render(<Loader />);

        const dotElements = container.querySelectorAll(`.${styles.dot}`);

        expect(dotElements).toHaveLength(6);

        dotElements.forEach((dotElement) => {
            const layerElements = dotElement.querySelectorAll(
                `.${styles.dotLayer}`
            );

            expect(layerElements).toHaveLength(3);
        });
    });
});
