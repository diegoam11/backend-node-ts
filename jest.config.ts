export default {
    preset: "ts-jest",
    testMatch: ["**/*.test.ts"],
    reporters: [
        "default",
        [
            "./node_modules/jest-html-reporter",
            {
                pageTitle: "Test Report",
                includeFailureMsg: true,
                inclugeConsoleLog: true,
                sort: "titleAsc",
            },
        ],
    ],
    setupFiles: ["<rootDir>/jest.setup.ts"],
};
