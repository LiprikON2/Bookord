import React from "react";
import { MantineProvider, ColorSchemeScript, ScrollArea } from "@mantine/core";

import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import { baseTheme } from "./theme";

import WindowFrame from "~/misc/window/components/WindowFrame";
import { AppShell } from "./AppShell";
import { Outlet } from "@tanstack/react-router";

console.log("[Renderer]: Execution started");

export const Root = () => {
    return (
        <>
            <ColorSchemeScript defaultColorScheme="dark" />
            <MantineProvider defaultColorScheme="dark" theme={baseTheme}>
                <React.StrictMode>
                    {/* <WindowFrame title="Bookord" platform="windows">
                        <Application />
                    </WindowFrame> */}

                    <AppShell>
                        <ScrollArea h="100%" type="auto">
                            <Outlet />
                        </ScrollArea>
                    </AppShell>
                </React.StrictMode>
            </MantineProvider>
        </>
    );
};
