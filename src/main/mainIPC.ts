import { type BrowserWindow, ipcMain, shell } from "electron";

export const registerMainIpc = (
    mainWindow: BrowserWindow,
    validateSender: (e: Electron.IpcMainInvokeEvent) => boolean
) => {
    ipcMain.handle("test", async (e) => {
        if (!validateSender(e)) return null;
        // const res = fetch("https://google.com");
        const res = new Promise((resolve, reject) => {
            resolve("HUUUH!");
        });
        return res;
    });
};
