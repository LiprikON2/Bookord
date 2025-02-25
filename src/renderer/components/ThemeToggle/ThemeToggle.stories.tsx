import type { Meta, StoryObj } from "@storybook/react";
import { within, fireEvent } from "@storybook/testing-library";
import { expect } from "@storybook/test";

import { ThemeToggle } from "./ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
    component: ThemeToggle,
};

export default meta;

type Story = StoryObj<typeof ThemeToggle>;

export const DefaultThemeToggle: Story = {
    args: {},
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const toggleButton = canvas.getByRole("button");

        const initialTheme = document.documentElement.getAttribute("data-mantine-color-scheme");
        await fireEvent.click(toggleButton, {
            // Delay between mouseDown and mouseUp
            delay: 50,
        });

        const newTheme = document.documentElement.getAttribute("data-mantine-color-scheme");
        await expect(newTheme).not.toBe(initialTheme);

        await fireEvent.click(toggleButton, { delay: 50 });
        const themeAfterSecondClick = document.documentElement.getAttribute(
            "data-mantine-color-scheme"
        );
        await expect(themeAfterSecondClick).toBe(initialTheme);
    },
};
