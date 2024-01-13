import { BrowserWindow, ipcMain } from "electron";

import { parseBooks } from "./main";

export const registerBookGridIpc = (
    mainWindow: BrowserWindow,
    validateSender: (e: Electron.IpcMainInvokeEvent) => boolean
) => {
    ipcMain.handle("upload-files", (e, files: FileObj[]) => {
        if (!validateSender(e)) return null;

        // mainWindow.close();
        parseBooks(files);
    });
};
