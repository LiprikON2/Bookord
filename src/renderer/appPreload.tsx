import { contextBridge } from "electron";

import "~/main/mainPreload";
import windowControlsContext, {
    type WindowControlsContextApi,
} from "./scenes/AppShell/scenes/Titlebar/components/WindowControls/ipc/windowControlsContext";
import bookGridContext, {
    type BookGridContextApi,
} from "./scenes/Library/scenes/BookGrid/ipc/bookGridContext";

declare global {
    interface Window {
        electron_window: {
            windowControls: WindowControlsContextApi;
            bookGrid: BookGridContextApi;
        };
    }
}

contextBridge.exposeInMainWorld("electron_window", {
    bookGrid: bookGridContext,

    windowControls: windowControlsContext,
});

console.log("[Preload]: Execution started");

// Get versions
window.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    const { env } = process;
    const versions: Record<string, unknown> = {};

    // ERWT Package version
    versions["bookord"] = env["npm_package_version"];
    versions["license"] = env["npm_package_license"];

    // Process versions
    for (const type of ["chrome", "node", "electron"]) {
        versions[type] = process.versions[type].replace("+", "");
    }

    // Set versions to app data
    app.setAttribute("data-versions", JSON.stringify(versions));
});
