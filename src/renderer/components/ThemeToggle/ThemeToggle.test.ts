import { test } from "vitest";
import { composeStories } from "@storybook/react";

import * as stories from "./ThemeToggle.stories";

const { ToggleThemeTwice } = composeStories(stories);

test("renders and executes the play function", async () => {
    // Mount story and run interactions
    await ToggleThemeTwice.run();
});
