import chokidar from "chokidar";
import path from "path";
import fs from "fs-extra";
import os from "os";

import { appDir } from "../mainWindow";
import { ipcRenderer, type BrowserWindow } from "electron";

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

export const initWatcher = (mainWindow: BrowserWindow) => {
    const watcher = chokidar.watch(appDir);

    watcher.on("add", (filePath) => {
        const fileName = path.parse(filePath).base;
        console.info("[watcher]: was added:", fileName);

        mainWindow.webContents.send("watcher-add", fileName);
    });
    watcher.on("unlink", (filePath) => {
        const fileName = path.parse(filePath).base;
        console.info("[watcher]: was deleted:", fileName);

        mainWindow.webContents.send("watcher-delete", fileName);
    });

    return watcher;
};

export default { initWatcher, addFiles };
