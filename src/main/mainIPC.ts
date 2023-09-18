import { type BrowserWindow, ipcMain, shell } from "electron";

export const registerMainIpc = (mainWindow: BrowserWindow) => {
    ipcMain.handle("test", async () => {
        // const res = fetch("https://google.com");
        const res = new Promise((resolve, reject) => {
            resolve("HUUUH!");
        });
        return res;
    });
};
