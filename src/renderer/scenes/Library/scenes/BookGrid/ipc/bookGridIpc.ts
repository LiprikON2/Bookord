import { BrowserWindow, MessageChannelMain, ipcMain, utilityProcess } from "electron";
import path from "path";

const parsingProccess = path.resolve(__dirname, "../forks/parsingProcess.mjs");

console.log("parsingProccess", parsingProccess);

const getResponse = (utilityProcess: Electron.UtilityProcess, toKillAfter = true) => {
    let promiseResolve: (value: unknown) => void;
    const promise = new Promise((resolve, reject) => (promiseResolve = resolve));

    utilityProcess.once("message", (res) => {
        console.info("[main] response received");
        promiseResolve(res);
        if (toKillAfter) utilityProcess.kill();
    });

    return promise;
};

export const registerBookGridIpc = (
    mainWindow: BrowserWindow,
    validateSender: (e: Electron.IpcMainInvokeEvent) => boolean
) => {
    ipcMain.handle("upload-files", (e, files: FileObj[]) => {
        if (!validateSender(e)) return null;

        const { port1, port2 } = new MessageChannelMain();
        const child = utilityProcess.fork(parsingProccess, [], {
            serviceName: "Book parsing utility process",
        });

        child.postMessage({ message: "hello" }, [port1]);
        console.info("[main] request sent");

        return getResponse(child);
    });
};
