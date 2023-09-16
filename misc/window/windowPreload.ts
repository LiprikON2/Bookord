import { contextBridge } from "electron";

import titlebarContext, { type TitlebarContextApi } from "./titlebarContext";

declare global {
    interface Window {
        electron_window: { titlebar: TitlebarContextApi };
    }
}

contextBridge.exposeInMainWorld("electron_window", {
    titlebar: titlebarContext,
});
