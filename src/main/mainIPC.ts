import { type BrowserWindow, ipcMain, shell } from "electron";

export const registerMainIPC = (mainWindow: BrowserWindow) => {
    ipcMain.handle("test", async () => {
        // const res = fetch("https://google.com");
        const res = new Promise((resolve, reject) => {
            resolve("HUUUH!");
        });

        console.log("res", await res);
        return res;
    });
};
