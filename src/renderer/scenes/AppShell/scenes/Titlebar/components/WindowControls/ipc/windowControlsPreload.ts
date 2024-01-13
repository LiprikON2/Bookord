import { contextBridge } from "electron";

import windowControlsContext, { type WindowControlsContextApi } from "./windowControlsContext";

declare global {
    interface Window {
        electron_window: { windowControls: WindowControlsContextApi };
    }
}

console.log("[Preload]: Loading windowControls");

contextBridge.exposeInMainWorld("electron_window", {
    windowControls: windowControlsContext,
});
