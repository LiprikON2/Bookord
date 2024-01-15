import { ipcRenderer } from "electron";

const bookGridContext = {
    uploadFiles(files: FileObj[]): Promise<number> {
        return ipcRenderer.invoke("upload-files", files);
    },
    openFileDialog(): Promise<number> {
        return ipcRenderer.invoke("open-file-dialog");
    },

    getMetadata(fileNames: string[]): Promise<any> {
        return ipcRenderer.invoke("get-metadata", fileNames);
    },

    watcherSendUpdate(): Promise<void> {
        return ipcRenderer.invoke("watcher-send-update");
    },

    deleteFile(fileName: string): Promise<void> {
        return ipcRenderer.invoke("delete-file", fileName);
    },

    apiYandexgpt(prompt: string): Promise<any> {
        return ipcRenderer.invoke("api-yandexgpt", prompt);
    },
};

export type BookGridContextApi = typeof bookGridContext;

export default bookGridContext;
