import { BrowserWindow, ipcMain, shell } from "electron";

export const registerTitlebarIpc = (
    mainWindow: BrowserWindow,
    validateSender: (e: Electron.IpcMainInvokeEvent) => boolean
) => {
    ipcMain.handle("window-minimize", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.minimize();
    });

    ipcMain.handle("window-maximize", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.maximize();
    });

    ipcMain.handle("window-toggle-maximize", (e) => {
        if (!validateSender(e)) return null;
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    });

    ipcMain.handle("window-close", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.close();
    });

    ipcMain.handle("web-undo", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.undo();
    });

    ipcMain.handle("web-redo", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.redo();
    });

    ipcMain.handle("web-cut", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.cut();
    });

    ipcMain.handle("web-copy", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.copy();
    });

    ipcMain.handle("web-paste", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.paste();
    });

    ipcMain.handle("web-delete", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.delete();
    });

    ipcMain.handle("web-select-all", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.selectAll();
    });

    ipcMain.handle("web-reload", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.reload();
    });

    ipcMain.handle("web-force-reload", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.reloadIgnoringCache();
    });

    ipcMain.handle("web-toggle-devtools", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.toggleDevTools();
    });

    ipcMain.handle("web-actual-size", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.setZoomLevel(0);
    });

    ipcMain.handle("web-zoom-in", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.setZoomLevel(mainWindow.webContents.zoomLevel + 0.5);
    });

    ipcMain.handle("web-zoom-out", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.webContents.setZoomLevel(mainWindow.webContents.zoomLevel - 0.5);
    });

    ipcMain.handle("web-toggle-fullscreen", (e) => {
        if (!validateSender(e)) return null;
        mainWindow.setFullScreen(!mainWindow.fullScreen);
    });

    ipcMain.handle("open-url", (e, url) => {
        if (!validateSender(e)) return null;
        shell.openExternal(url);
    });
};
