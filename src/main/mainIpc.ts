import { ipcMain } from "electron";

import { type WatcherState } from "./utils/io";
import { MainWindow } from "./mainWindow";

export const registerMainIpc = (
    mainWindow: MainWindow,
    validateSender: (e: Electron.IpcMainInvokeEvent) => boolean
) => {
    // ipcMain.handle("test", async (e) => {
    //     if (!validateSender(e)) return null;
    //     // const res = fetch("https://google.com");
    //     const res = new Promise((resolve, reject) => {
    //         resolve("HUUUH!");
    //     });
    //     return res;
    // });
    //
    // ipcMain.handle("send-watcher-update", async (e, watcherState: WatcherState) => {
    //     if (!validateSender(e)) return null;
    //     mainWindow.webContents.send("watcher-update", watcherState);
    // });
};
