import { MessageChannelMain, app, ipcMain, utilityProcess } from "electron";
import path from "path";

import io, { getResponse } from "~/main/utils";
import { type BookContent } from "../..";
import { MainWindow } from "~/main/mainWindow";

export const registerStoreIpc = (
    mainWindow: MainWindow,
    validateSender: (e: Electron.IpcMainInvokeEvent) => boolean
) => {
    ipcMain.handle("get-parsed-metadata", async (e, fileNames: string[]) => {
        if (!validateSender(e)) return null;

        const { port1, port2 } = new MessageChannelMain();
        const metadataParsingProcess = path.resolve(
            __dirname,
            "../forks/metadataParsingProcess.mjs"
        );

        const child = utilityProcess.fork(metadataParsingProcess, [], {
            serviceName: "Book metadata parsing utility process",
        });
        const filePaths = io.namesToPaths(fileNames);

        child.postMessage({ filePaths }, [port1]);
        console.info("[main] request sent");

        return getResponse(child);
    });

    ipcMain.handle("get-parsed-content", async (e, fileName: string, initSectionIndex: number) => {
        if (!validateSender(e)) return null;

        const { port1, port2 } = new MessageChannelMain();
        const contentsParsingProcess = path.resolve(
            __dirname,
            "../forks/contentsParsingProcess.mjs"
        );

        const child = utilityProcess.fork(contentsParsingProcess, [], {
            serviceName: "Book content parsing utility process",
        });
        const [filePath] = io.namesToPaths([fileName]);

        child.postMessage({ filePath, initSectionIndex }, [port1]);
        console.info("[main] request sent");

        const initContent = (await getResponse(child, false)) as BookContent;
        mainWindow.webContents.send("parsed-content-init", {
            bookKey: fileName,
            initContent,
        });

        await Promise.all(
            initContent.sections.map(async ({ id }, index) => {
                const toKillAfter = index + 1 === initContent.sections.length;
                const section = (await getResponse(child, toKillAfter, id)) as ArrayElement<
                    BookContent["sections"]
                >;

                mainWindow.webContents.send("parsed-content-section", {
                    bookKey: fileName,
                    sectionIndex: index,
                    section,
                });
            })
        );
        return;
    });
};
