import { contextBridge, ipcRenderer } from "electron";

import "~/main/mainPreload";
import windowControlsContext, {
    type WindowControlsContextApi,
} from "./scenes/AppShell/scenes/Titlebar/components/WindowControls/ipc/windowControlsContext";
import thirdPartyApiContext, {
    type ThirdPartyApiContextApi,
} from "./ipc/thirdPartyApi/thirdPartyApiContext";
import storeContext, { type StoreContextApi } from "./stores/BookStore/ipc/storeContext";
import fileOperationsContext, {
    type FileOperationsContextApi,
} from "./ipc/fileOperations/fileOperationsContext";

console.log("[Preload]: Execution started");

declare global {
    interface Window {
        electron_window: {
            windowControls: WindowControlsContextApi;
            thirdPartyApi: ThirdPartyApiContextApi;
            store: StoreContextApi;
            fileOperations: FileOperationsContextApi;
            events: typeof eventsContext;
        };
    }
}

const eventsContext = (channel: string, callback: (...args: any[]) => void) => {
    // Deliberately strip event as it includes `sender`
    const subscription = (event: Electron.IpcRendererEvent, ...args: any[]) => callback(...args);

    ipcRenderer.on(channel, subscription);
    console.info("[Preload]: subscription added:", channel);

    return () => {
        console.info("[Preload]: subscription removed:", channel);
        ipcRenderer.removeListener(channel, subscription);
    };
};

contextBridge.exposeInMainWorld("electron_window", {
    windowControls: windowControlsContext,
    events: eventsContext,
    store: storeContext,
    fileOperations: fileOperationsContext,
    thirdPartyApi: thirdPartyApiContext,
});

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
