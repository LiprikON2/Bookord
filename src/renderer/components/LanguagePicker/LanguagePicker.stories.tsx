import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, screen, waitFor } from "@storybook/testing-library";
import { expect, fn } from "@storybook/test";

import { LanguagePicker, Selection } from "./LanguagePicker";
import flags from "~/assets/images/flags/language";

const meta: Meta<typeof LanguagePicker> = {
    component: LanguagePicker,
};

export default meta;

type Story = StoryObj<typeof LanguagePicker>;

const englishOptionData = { label: "English", image: flags.en };
const russianOptionData = { label: "Russian", image: flags.ru };

const data = [englishOptionData, russianOptionData];

export const Static: Story = {
    args: {
        data,
        selected: data[0],
        onSelect: fn(),
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

        // Verify onSelect was called with Russian language object
        expect(args.onSelect).toHaveBeenCalledTimes(1);
        expect(args.onSelect).toHaveBeenCalledWith(englishOptionData);
    },
};

const WithState = (Story: any) => {
    const [selected, setSelected] = useState<Selection>(englishOptionData);

    return (
        <Story
            args={{
                data,
                selected,
                onSelect: (selection: Selection) => {
                    setSelected(selection);
                    console.log("Language selected:", selection);
                },
            }}
        />
    );
};

export const Interactive: Story = {
    decorators: [WithState],
    args: {
        data,
        selected: data[0],
        onSelect: fn(),
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
