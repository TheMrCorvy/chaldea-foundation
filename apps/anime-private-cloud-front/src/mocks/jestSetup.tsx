import {
    AnchorHTMLAttributes,
    ClassAttributes,
    ImgHTMLAttributes,
} from "react";

export const pushMock = jest.fn();
export const replaceMock = jest.fn();
export const backMock = jest.fn();
export const queryMock = jest.fn();
export const asPathMock = jest.fn();

export const mockUseRouter = {
    useRouter() {
        return {
            push: pushMock,
            replace: replaceMock,
            back: backMock,
            asPath: asPathMock,
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
        };
    },
};

export const mockNextImage = {
    __esModule: true,
    default: (
        props: JSX.IntrinsicAttributes &
            ClassAttributes<HTMLImageElement> &
            ImgHTMLAttributes<HTMLImageElement>
    ) => <img {...props} />,
};

export const mockNextLink = {
    __esModule: true,
    default: (
        props: JSX.IntrinsicAttributes &
            ClassAttributes<HTMLAnchorElement> &
            AnchorHTMLAttributes<HTMLAnchorElement>
    ) => <a {...props} role="link" />,
};

export const mockNextServer = {
    NextRequest: jest.fn(() => ({ url: "http://localhost", headers: {} })),
    NextResponse: jest.fn(() => ({
        status: jest.fn(() => ({ json: jest.fn })),
    })),
};
