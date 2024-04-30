import { dialog, ipcMain } from "electron";
import path from "path";

import { MainWindow, appDir } from "~/main/mainWindow";
import io from "~/main/utils";

export const registerFileOperationsIpc = (
    mainWindow: MainWindow,
    validateSender: (e: Electron.IpcMainInvokeEvent) => boolean
) => {
    ipcMain.handle("upload-files", (e, files: FileObj[]) => {
        if (!validateSender(e)) return null;
        return io.addFiles(appDir, files);
    });

    ipcMain.handle("open-file-dialog", (e) => {
        if (!validateSender(e)) return null;
        // TODO sync file dialog halts main process while it is opened,
        // meanwhile renderer process is responsive

        // TODO doesn't go in focus on linux
        const filePaths = dialog.showOpenDialogSync({
            properties: ["openFile", "multiSelections"],
            filters: [
                {
                    name: "All Files",
                    extensions: [
                        "epub",
                        // "fb2",
                        // "txt",
                        // "htm",
                        // "html",
                        // "xhtml",
                        // "xml",
                        // "mobi",
                        // "azw",
                        // "pdf",
                    ],
                },
                { name: "ePub Files", extensions: ["epub"] },
                // { name: "FictionBook Files", extensions: ["fb2"] },
                // { name: "Text Files", extensions: ["txt"] },
                // { name: "HTML Files", extensions: ["htm", "html", "xhtml"] },
                // { name: "XML Files", extensions: ["xml"] },
                // { name: "Mobipocket eBook Files", extensions: ["mobi"] },
                // { name: "Kindle File Format Files", extensions: ["azw"] },
                // { name: "Portable Document Format Files", extensions: ["pdf"] },
            ],
        });

        if (filePaths && filePaths.length) {
            const files = filePaths.map((filePath) => ({
                name: path.parse(filePath).base,
                path: filePath,
            }));

            return io.addFiles(appDir, files);
        }
    });

    ipcMain.handle("delete-file", (e, fileName: string) => {
        if (!validateSender(e)) return null;

        return io.deleteFile(fileName);
    });

    ipcMain.handle("request-watcher-update", (e) => {
        if (!validateSender(e)) return null;

        const watcherState = mainWindow.watcher.getWatcherState();
        mainWindow.webContents.send("watcher-update", watcherState);
    });
};
