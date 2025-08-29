import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import SignInForm from ".";

describe("SignInForm", () => {
    it("should render properly", () => {
        render(<SignInForm isRegisterForm={false} />);

        const form = screen.queryByTestId("sign-in-form");

        expect(form).toBeInTheDocument();
    });

    it("should render properly with login inputs", () => {
        render(<SignInForm isRegisterForm={false} />);

        const identifierInput = screen.queryByTestId("sign-in-identifier");

        expect(identifierInput).toBeInTheDocument();
    });

    it("should render properly with register inputs", () => {
        render(<SignInForm isRegisterForm={true} />);

        const emailInput = screen.queryByTestId("sign-in-email");

        expect(emailInput).toBeInTheDocument();
    });
});
