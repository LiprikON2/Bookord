import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { expect, waitFor } from "@storybook/test";

import { ThemeToggle } from "./ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
    component: ThemeToggle,
};

export default meta;

type Story = StoryObj<typeof ThemeToggle>;

const getDocumentTheme = () => document.documentElement.getAttribute("data-mantine-color-scheme");

export const ToggleThemeTwice: Story = {
    args: {},
    parameters: {
        layout: "centered",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const toggleButton = canvas.getByRole("button");

        const initialTheme = getDocumentTheme();

        userEvent.click(toggleButton);
        await waitFor(() => expect(getDocumentTheme()).not.toBe(initialTheme));

        userEvent.click(toggleButton);
        await waitFor(() => expect(getDocumentTheme()).toBe(initialTheme));
    },
};
