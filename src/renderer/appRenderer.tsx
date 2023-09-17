import React from "react";
import { createRoot } from "react-dom/client";
import WindowFrame from "~/misc/window/components/WindowFrame";
import Application from "~/components/Application";
import { MantineProvider } from "@mantine/core";

import { baseTheme } from "./theme";

console.log("[Renderer]: Execution started");

// Application to Render
const app = (
    <MantineProvider theme={baseTheme}>
        <React.StrictMode>
            <WindowFrame title="Bookord" platform="windows">
                <Application />
            </WindowFrame>
        </React.StrictMode>
    </MantineProvider>
);

// Render application in DOM
createRoot(document.getElementById("app")).render(app);
