import { contextBridge } from "electron";

import mainContext, { type MainContextApi } from "./mainContext";

declare global {
    interface Window {
        electron_main: { main: MainContextApi };
    }
}

contextBridge.exposeInMainWorld("electron_main", {
    main: mainContext,
});
