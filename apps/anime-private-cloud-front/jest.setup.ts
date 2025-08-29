import {
    mockNextImage,
    mockNextLink,
    mockNextServer,
    mockUseRouter,
} from "@/mocks/jestSetup";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => mockUseRouter);
jest.mock("next/image", () => mockNextImage);
jest.mock("next/server", () => mockNextServer);
jest.mock("next/link", () => mockNextLink);
