import React, { useState } from "react";
import { type ColorScheme, MantineProvider, ColorSchemeProvider } from "@mantine/core";

import { createRoot } from "react-dom/client";
import WindowFrame from "~/misc/window/components/WindowFrame";
import Application from "~/components/Application";

import { baseTheme } from "./theme";

console.log("[Renderer]: Execution started");

const App = () => {
    const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            {/* <MantineProvider withNormalizeCSS withGlobalStyles theme={baseTheme}> */}
            <MantineProvider withNormalizeCSS theme={baseTheme}>
                <React.StrictMode>
                    <WindowFrame title="Bookord" platform="windows">
                        <Application />
                    </WindowFrame>
                </React.StrictMode>
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

// Render application in DOM
createRoot(document.getElementById("app")).render(<App />);
