import React, { useEffect } from "react";
import { MantineProvider, useMantineColorScheme } from "@mantine/core";
import { Preview } from "@storybook/react";
import { addons } from "@storybook/preview-api";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";

import { useAppTheme } from "../src/renderer/hooks";
import "@mantine/core/styles.layer.css";
import "@mantine/dropzone/styles.layer.css";
import "@mantine/notifications/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";
import "mantine-contextmenu/styles.layer.css";
import "~/renderer/layout.css";

const channel = addons.getChannel();

function ColorSchemeWrapper({ children }: { children: React.ReactNode }) {
    const { setColorScheme } = useMantineColorScheme();
    const handleColorScheme = (value: boolean) => setColorScheme(value ? "dark" : "light");

    useEffect(() => {
        channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
        return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
    }, [channel]);

    return <>{children}</>;
}

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story) => (
            <ColorSchemeWrapper>
                <Story />
            </ColorSchemeWrapper>
        ),
        (Story) => {
            const appTheme = useAppTheme();

            return (
                <MantineProvider defaultColorScheme="dark" theme={appTheme}>
                    <Story />
                </MantineProvider>
            );
        },
    ],
};

export default preview;
