import chokidar from "chokidar";
import path from "path";
import fs from "fs-extra";
import { MainWindow, appDir } from "../mainWindow";

export type WatcherState = {
    bookKeys: string[];
};

export const addFiles = (appDir: string, files: FileObj[] = []) => {
    // Ensure `appDir` folder exists
    fs.ensureDirSync(appDir);

    let newFilesCount = files.length;
    // Copy `files` recursively (ignore duplicate file names)
    files.forEach((file) => {
        const filePath = path.resolve(appDir, file.name);

        if (!fs.existsSync(filePath)) {
            fs.copyFileSync(file.path, filePath);
        } else {
            newFilesCount--;
        }
    });
    // Don't display notification if all files are duplicates
    if (newFilesCount !== 0) {
        // notification.filesAdded(newFilesCount);
    }
    return newFilesCount;
};

export const namesToPaths = (fileNames: string[]) => {
    return fileNames.map((fileName) => path.join(appDir, fileName));
};

export const deleteFile = (fileName: string) => {
    const filePath = path.resolve(appDir, fileName);

    // Remove file from the appDir
    if (fs.existsSync(filePath)) {
        fs.removeSync(filePath);
    }
};

export class Watcher {
    appDir;
    watcher;
    constructor(appDir: string, mainWindow: MainWindow) {
        this.appDir = appDir;
        this.watcher = chokidar.watch(appDir);
        console.info("[watcher]: appDir", appDir);

        // Added file event
        this.watcher.on("add", (filePath, stats) => {
            const fileName = path.parse(filePath).base;
            console.info("[watcher]: was added:", fileName);

            const watcherState = this.getWatcherState();
            mainWindow.webContents.send("watcher-update", watcherState);
        });
        // Removed file event
        this.watcher.on("unlink", (filePath) => {
            const fileName = path.parse(filePath).base;
            console.info("[watcher]: was deleted:", fileName);

            const watcherState = this.getWatcherState();
            mainWindow.webContents.send("watcher-update", watcherState);
        });
    }

    getWatcherState = (): WatcherState => {
        const watcherState = {
            bookKeys: this.watcher.getWatched()[this.appDir],
        };
        return watcherState;
    };

    close() {
        return this.watcher.close();
    }
}

// export const watcher = chokidar.watch(appDir);

// export const getWatcherState = (): WatcherState => {
//     const watcherState = {
//         bookKeys: watcher.getWatched()[appDir],
//     };
//     return watcherState;
// };

// app.on("ready", () => {
//     // Added file event
//     watcher.on("add", (filePath) => {
//         const fileName = path.parse(filePath).base;
//         console.info("[watcher]: was added:", fileName);

//         const watcherState = getWatcherState();
//         context.sendWatcherUpdate(watcherState);
//     });
//     // Removed file event
//     watcher.on("unlink", (filePath) => {
//         const fileName = path.parse(filePath).base;
//         console.info("[watcher]: was deleted:", fileName);

//         const watcherState = getWatcherState();
//         context.sendWatcherUpdate(watcherState);
//     });
// });

export default {
    // getWatcherState,
    // watcher,
    Watcher,
    addFiles,
    namesToPaths,
    deleteFile,
};
