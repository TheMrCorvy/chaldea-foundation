import { fireEvent, render, screen } from "@testing-library/react";
import { ReactNode } from "react";

import SearchModal from ".";

interface MockModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

interface MockWrapperProps {
    children: ReactNode;
}

jest.mock("@mui/joy/Modal", () => ({
    __esModule: true,
    default: ({ open, onClose, children }: MockModalProps) => {
        if (!open) {
            return null;
        }

        return (
            <div data-testid="joy-modal">
                <button type="button" onClick={onClose}>
                    Cerrar modal
                </button>
                {children}
            </div>
        );
    },
}));

jest.mock("@mui/joy/ModalDialog", () => ({
    __esModule: true,
    default: ({ children }: MockWrapperProps) => (
        <div data-testid="joy-modal-dialog">{children}</div>
    ),
}));

jest.mock("@mui/joy/DialogContent", () => ({
    __esModule: true,
    default: ({ children }: MockWrapperProps) => (
        <div data-testid="joy-dialog-content">{children}</div>
    ),
}));

describe("SearchModal", () => {
    it("renders children when open is true", () => {
        render(
            <SearchModal open onClose={jest.fn<void, []>()}>
                <div>Contenido del modal</div>
            </SearchModal>
        );

        expect(screen.getByText("Contenido del modal")).toBeInTheDocument();
    });

    it("does not render children when open is false", () => {
        render(
            <SearchModal open={false} onClose={jest.fn<void, []>()}>
                <div>Contenido oculto</div>
            </SearchModal>
        );

        expect(screen.queryByText("Contenido oculto")).not.toBeInTheDocument();
    });

    it("calls onClose when close action is triggered", () => {
        const onClose = jest.fn<void, []>();

        render(
            <SearchModal open onClose={onClose}>
                <div>Modal activo</div>
            </SearchModal>
        );

        fireEvent.click(screen.getByRole("button", { name: "Cerrar modal" }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
