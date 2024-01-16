import { BrowserWindow, MessageChannelMain, dialog, ipcMain, utilityProcess } from "electron";
import path from "path";
import axios from "axios";

import io, { getResponse } from "~/main/utils";
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

    ipcMain.handle("get-metadata", (e, fileNames: string[]) => {
        if (!validateSender(e)) return null;

        const { port1, port2 } = new MessageChannelMain();
        const child = utilityProcess.fork(parsingProccess, [], {
            serviceName: "Book parsing utility process",
        });
        const filePaths = io.namesToPaths(fileNames);

        child.postMessage({ filePaths }, [port1]);
        console.info("[main] request sent");

        return getResponse(child);
    });

    ipcMain.handle("delete-file", (e, fileName: string) => {
        if (!validateSender(e)) return null;

        return io.deleteFile(fileName);
    });

    ipcMain.handle(
        "api-yandexgpt",
        (e, prompt: string, yandexIamToken: string, yandexFolderId: string) => {
            if (!validateSender(e)) return null;

            return axios
                .post(
                    "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
                    {
                        modelUri: `gpt://${yandexFolderId}/yandexgpt-lite`,
                        completionOptions: {
                            stream: false,
                            temperature: 0.6,
                            maxTokens: "2000",
                        },
                        messages: [
                            {
                                role: "system",
                                text: prompt,
                            },
                        ],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${yandexIamToken}`,
                            "x-folder-id": "yandexFolderId",
                        },
                    }
                )
                .then((res) => res.data.result.alternatives[0].message.text);
        }
    );
};
