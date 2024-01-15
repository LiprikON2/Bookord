import chokidar from "chokidar";
import path from "path";
import fs from "fs-extra";
import os from "os";

import { appDir } from "../mainWindow";
import { ipcRenderer, type BrowserWindow, ipcMain } from "electron";

export const addFiles = (appDir: string, files: FileObj[] = []) => {
    // Ensure `appDir` folder exists
    fs.ensureDirSync(appDir);

    let distinctFilesCount = files.length;
    // Copy `files` recursively (ignore duplicate file names)
    files.forEach((file) => {
        const filePath = path.resolve(appDir, file.name);

        if (!fs.existsSync(filePath)) {
            fs.copyFileSync(file.path, filePath);
        } else {
            distinctFilesCount--;
        }
    });
    // Don't display notification if all files are duplicates
    if (distinctFilesCount !== 0) {
        // notification.filesAdded(newFilesCount);
    }
    return distinctFilesCount;
};

export const initWatcher = (
    mainWindow: BrowserWindow,
    validateSender: (e: Electron.IpcMainInvokeEvent) => boolean
) => {
    const watcher = chokidar.watch(appDir);

    ipcMain.handle("watcher-send-update", async (e) => {
        if (!validateSender(e)) return null;

        const watcherEvent = {
            list: watcher.getWatched()[appDir],
            update: {
                action: "get-list",
            },
        };

        mainWindow.webContents.send("watcher-update", watcherEvent);
        return;
    });

    watcher.on("add", (filePath) => {
        const fileName = path.parse(filePath).base;
        console.info("[watcher]: was added:", fileName);

        const watcherEvent = {
            list: watcher.getWatched()[appDir],
            update: {
                action: "add",
                fileName,
            },
        };

        mainWindow.webContents.send("watcher-add", watcherEvent);
        // TODO add types
        mainWindow.webContents.send("watcher-update", watcherEvent);
    });
    watcher.on("unlink", (filePath) => {
        const fileName = path.parse(filePath).base;
        console.info("[watcher]: was deleted:", fileName);

        const watcherEvent = {
            list: watcher.getWatched()[appDir],
            update: {
                action: "delete",
                fileName,
            },
        };
        mainWindow.webContents.send("watcher-delete", watcherEvent);
        mainWindow.webContents.send("watcher-update", watcherEvent);
    });

    return watcher;
};

export const namesToPaths = (fileNames: string[]) => {
    return fileNames.map((fileName) => path.join(appDir, fileName));
};

export default { initWatcher, addFiles, namesToPaths };
