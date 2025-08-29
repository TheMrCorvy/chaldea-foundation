import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Invitation from ".";

describe("Invitation", () => {
    it("should render properly on login layout", () => {
        render(<Invitation />);

        const invitationComponent = screen.queryByTestId(
            "invitation-component"
        );

        expect(invitationComponent).toBeInTheDocument();
    });

    it("should render properly on register layout", () => {
        render(
            <Invitation
                isRegisterForm={true}
                invitationNumber={2}
                userName="Test User"
            />
        );

        const ticketComponent = screen.queryByTestId("invitation-component");
        const userName = screen.queryByText("Test User");

        expect(ticketComponent).toBeInTheDocument();
        expect(userName).toBeInTheDocument();
    });
});
