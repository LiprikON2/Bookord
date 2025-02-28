import { beforeEach, test, vi } from "vitest";
import { composeStories } from "@storybook/react";

import * as stories from "./Combobox.stories";

const { Static, Interactive } = composeStories(stories);

test("renders and executes the play function", async () => {
    // Mount story and run interactions
    // await Static.run();
    await Interactive.run();
});
