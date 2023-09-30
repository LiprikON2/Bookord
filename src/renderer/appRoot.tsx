import React from "react";
import { MantineProvider, ColorSchemeScript, ScrollArea, rem } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";

import { baseTheme } from "./theme";
import "@mantine/core/styles.layer.css";
import "@mantine/dropzone/styles.layer.css";
import "@mantine/notifications/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";

import { AppShell } from "~/renderer/scenes";

console.log("[Renderer]: Execution started");

export const Root = () => {
    return (
        <>
            <ColorSchemeScript defaultColorScheme="dark" />
            <MantineProvider defaultColorScheme="dark" theme={baseTheme}>
                <React.StrictMode>
                    <AppShell>
                        <ScrollArea
                            h="100%"
                            type="auto"
                            styles={{ scrollbar: { margin: "-1px", marginTop: rem(8) } }}
                        >
                            <Outlet />
                        </ScrollArea>
                    </AppShell>
                </React.StrictMode>
            </MantineProvider>
        </>
    );
};
