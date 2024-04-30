import { ipcRenderer } from "electron";
import type { WatcherState } from "./utils/io";

const mainContext = {
    // test(): Promise<string> {
    //     return ipcRenderer.invoke("test");
    // },
    //
    // for some reason ipcRenderer is undefined
    // sendWatcherUpdate(watcherState: WatcherState): Promise<void> {
    //     return ipcRenderer.invoke("send-watcher-update", watcherState);
    // },
};

export type MainContextApi = typeof mainContext;

export default mainContext;
