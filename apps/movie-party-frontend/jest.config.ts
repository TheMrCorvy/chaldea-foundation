export default {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "\.(css|less|scss|sass)$": "identity-obj-proxy",
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
        "^.+\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.app.json",
            },
        ],
    },
    testRegex: "(/__tests__/.*|(\.|/)(test|spec))\.[jt]sx?$",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
