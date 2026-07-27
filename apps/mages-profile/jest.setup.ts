import "@testing-library/jest-dom";

jest.mock("@salvatore.hakase/log-data", () => ({
    logData: jest.fn(),
}));
