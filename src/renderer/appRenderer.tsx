import React, { useState } from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import "@mantine/core/styles.css";

import { createRoot } from "react-dom/client";
import WindowFrame from "~/misc/window/components/WindowFrame";
import Application from "~/components/Application";
import { baseTheme } from "./theme";

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
