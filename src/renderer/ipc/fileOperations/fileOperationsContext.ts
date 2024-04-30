import { ipcRenderer } from "electron";

import type { BookKey } from "~/renderer/stores";

const fileOperationsContext = {
    uploadFiles(files: FileObj[]): Promise<number> {
        return ipcRenderer.invoke("upload-files", files);
    },
    openFileDialog(): Promise<number> {
        return ipcRenderer.invoke("open-file-dialog");
    },
    deleteFile(fileName: string): Promise<void> {
        return ipcRenderer.invoke("delete-file", fileName);
    },

    requestWatcherUpdate(): Promise<void> {
        return ipcRenderer.invoke("request-watcher-update");
    },

    handleWatcherUpdate(callback: (watcherState: { bookKeys: BookKey[] }) => void) {
        const channel = "watcher-update";
        // Deliberately strip event as it includes `sender`
        const subscription = (event: Electron.IpcRendererEvent, watcherState: any) =>
            callback(watcherState);

        ipcRenderer.on(channel, subscription);
        console.info("[ipc]: subscription added:", channel);

        return () => {
            ipcRenderer.off(channel, subscription);
            console.info("[ipc]: subscription removed:", channel);
        };
    },
};

export type FileOperationsContextApi = typeof fileOperationsContext;

export default fileOperationsContext;
