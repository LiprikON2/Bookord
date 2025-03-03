import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { expect, waitFor } from "@storybook/test";
import React from "react";

import { PageSkeleton } from "./PageSkeleton";

const meta: Meta<typeof PageSkeleton> = {
    component: PageSkeleton,
};

export default meta;

type Story = StoryObj<typeof PageSkeleton>;

const WithinContainer = (Story: any) => {
    return (
        <div style={{ width: "300px", maxHeight: "400px", overflow: "hidden" }}>
            <Story />
        </div>
    );
};

export const Base: Story = {
    decorators: [WithinContainer],
    args: {},
    parameters: {
        layout: "centered",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // await waitFor(() => expect(canvas).toBe(canvas));
    },
};
