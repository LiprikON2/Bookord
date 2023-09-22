import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { createRoot } from "react-dom/client";

import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import { baseTheme } from "./theme";

import WindowFrame from "~/misc/window/components/WindowFrame";
import { Application } from "./Application";

console.log("[Renderer]: Execution started");

const App = () => {
    return (
        <>
            <ColorSchemeScript defaultColorScheme="dark" />
            <MantineProvider defaultColorScheme="dark" theme={baseTheme}>
                <React.StrictMode>
                    <WindowFrame title="Bookord" platform="windows">
                        <Application />
                    </WindowFrame>
                </React.StrictMode>
            </MantineProvider>
        </>
    );
};

// Render application in DOM
createRoot(document.getElementById("app")).render(<App />);
