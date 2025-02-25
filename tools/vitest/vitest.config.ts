import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

import aliases from "../webpack/webpack.aliases";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true, // allows us to use vitest library methods in unit test without explicit imports
        environment: "jsdom",
        setupFiles: "./tests/setup.ts", // path to setup file

        coverage: {
            provider: "v8",
            include: ["src/**/*.{js,jsx,ts,tsx}"], // specify files to include
            exclude: ["src/**/index.ts", "src/**/*.stories.{js,jsx,ts,tsx}"], // specify files to exclude
        },
    },
    resolve: {
        alias: aliases as any,
    },
});
