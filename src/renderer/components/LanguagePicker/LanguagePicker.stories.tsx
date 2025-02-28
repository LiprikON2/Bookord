import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, screen, waitFor } from "@storybook/testing-library";
import { expect, fn } from "@storybook/test";

import { LanguagePicker } from "./LanguagePicker";
import flags from "~/assets/images/flags/language";
import { IconFlag } from "@tabler/icons-react";

const meta: Meta<typeof LanguagePicker> = {
    component: LanguagePicker,
};

export default meta;

type Story = StoryObj<typeof LanguagePicker>;

const englishOptionData = { value: "en", label: "English", image: flags.en };
const russianOptionData = { value: "ru", label: "Russian", image: flags.ru };
const flagOptionData = { value: "flag", label: "Icon", Icon: IconFlag };
const noIconOptionData = { value: "no", label: "No Icon" };

const data = [englishOptionData, russianOptionData, flagOptionData, noIconOptionData];

export const Static: Story = {
    args: {
        data,
        selected: "en",
        onChange: fn(),
    },
    parameters: {
        layout: "centered",
    },
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement);

        const picker = await canvas.findByRole("button");
        await userEvent.click(picker);

        // Wait for options in portal
        const [_, englishOption] = await screen.findAllByText(/english/i);

        await userEvent.click(englishOption);

        // Verify onChange was called with Russian language object
        expect(args.onChange).toHaveBeenCalledTimes(1);
        expect(args.onChange).toHaveBeenCalledWith("en");
    },
};

const WithState = (Story: any) => {
    const [selected, setSelected] = useState("en");

    return (
        <Story
            args={{
                data,
                selected,
                onChange: (value: string) => {
                    setSelected(value);
                    console.log("Language selected:", value);
                },
            }}
        />
    );
};

export const Interactive: Story = {
    decorators: [WithState],
    args: {
        data,
        selected: "en",
        onChange: fn(),
    },
    parameters: {
        layout: "centered",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // Find and click the picker button
        const picker = await canvas.findByRole("button");
        await userEvent.click(picker);

        // Wait for options in portal and click Russian
        const russianOption = await screen.findByText(/russian/i);
        await userEvent.click(russianOption);

        // Verify Russian is selected
        await expect(picker).toHaveTextContent(/russian/i);

        // Click again to open options
        await userEvent.click(picker);

        // Find and click English option
        const englishOption = await screen.findByText(/english/i);
        await userEvent.click(englishOption);

        // Verify English is selected
        await expect(picker).toHaveTextContent(/english/i);
    },
};
