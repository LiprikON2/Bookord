import { BrowserWindow, MessageChannelMain, dialog, ipcMain, utilityProcess } from "electron";
import path from "path";

import io from "~/main/utils";
import { appDir } from "~/main/mainWindow";
const parsingProccess = path.resolve(__dirname, "../forks/parsingProcess.mjs");

export const registerBookGridIpc = (
    mainWindow: BrowserWindow,
    validateSender: (e: Electron.IpcMainInvokeEvent) => boolean
) => {
    ipcMain.handle("upload-files", (e, files: FileObj[]) => {
        if (!validateSender(e)) return null;
        return io.addFiles(appDir, files);
    });

    ipcMain.handle("open-file-dialog", (e) => {
        if (!validateSender(e)) return null;
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
};
