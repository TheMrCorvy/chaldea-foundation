import type { Config } from "@jest/types";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    dir: "./",
});

const config: Config.InitialOptions = {
    coverageProvider: "v8",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    preset: "ts-jest",
    moduleNameMapper: {
        "^react$": "<rootDir>/node_modules/react",
        "^react-dom$": "<rootDir>/node_modules/react-dom",
        "^react/jsx-runtime$": "<rootDir>/node_modules/react/jsx-runtime.js",
        "^react/jsx-dev-runtime$":
            "<rootDir>/node_modules/react/jsx-dev-runtime.js",
    },
};

export default createJestConfig(config);
