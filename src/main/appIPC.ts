import { type BrowserWindow, ipcMain, shell } from "electron";

export const registerAppIPC = (mainWindow: BrowserWindow) => {
    ipcMain.handle("test", () => {
        const res = fetch("https://google.com");
        console.log("res", res);
        return res;
    });
};
