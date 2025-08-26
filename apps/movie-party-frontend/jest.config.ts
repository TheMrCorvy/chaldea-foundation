import type { Config } from "jest";

const config: Config = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
        "^.+\.(js|jsx|ts|tsx)$": "babel-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testMatch: [
        "**/__tests__/**/*.(ts|tsx|js|jsx)",
        "**/*.(test|spec).(ts|tsx|js|jsx)",
    ],
};

export default config;
