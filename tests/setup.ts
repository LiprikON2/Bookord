import "@testing-library/jest-dom/vitest"; //extends Vitest's expect method with methods from react-testing-library
import { cleanup } from "@testing-library/react";
import { beforeAll, afterEach } from "vitest";
import { setProjectAnnotations } from "@storybook/react";

import "./mocks";
import previewAnnotations from "../.storybook/preview";

// Run Storybook's beforeAll hook
const annotations = setProjectAnnotations([previewAnnotations]);
beforeAll(annotations.beforeAll);

// ref: https://medium.com/@kafkahw/adding-vitest-react-testing-library-to-an-existing-react-project-w-o-vite-97e4aeb2ae2d
// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
    cleanup();
});
