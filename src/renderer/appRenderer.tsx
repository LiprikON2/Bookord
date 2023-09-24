import React from "react";
import { MantineProvider, ColorSchemeScript, ScrollArea } from "@mantine/core";
import { createRoot } from "react-dom/client";

import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import { baseTheme } from "./theme";

import WindowFrame from "~/misc/window/components/WindowFrame";
import { Application } from "./Application";
import { AppShell } from "./AppShell";

console.log("[Renderer]: Execution started");

const App = () => {
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
                            <Application />
                        </ScrollArea>
                    </AppShell>
                </React.StrictMode>
            </MantineProvider>
        </>
    );
};

createRoot(document.getElementById("app")).render(<App />);
