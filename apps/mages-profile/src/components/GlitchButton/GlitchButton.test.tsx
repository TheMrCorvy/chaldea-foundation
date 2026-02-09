import { render, screen } from "@testing-library/react";
import GlitchButton from "./index";

describe("GlitchButton", () => {
    it("renders the button with the correct text", () => {
        render(<GlitchButton label="Click me" />);
        const buttonElement = screen.getByText(/Click me/i);
        expect(buttonElement).toBeInTheDocument();
    });
});
