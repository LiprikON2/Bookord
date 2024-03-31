import { ipcRenderer } from "electron";

const bookGridContext = {
    uploadFiles(files: FileObj[]): Promise<number> {
        return ipcRenderer.invoke("upload-files", files);
    },
    openFileDialog(): Promise<number> {
        return ipcRenderer.invoke("open-file-dialog");
    },

    getParsedMetadata(fileNames: string[]): Promise<any> {
        return ipcRenderer.invoke("get-parsed-metadata", fileNames);
    },

    getParsedContent(fileName: string, initSectionIndex: number): Promise<any> {
        return ipcRenderer.invoke("get-parsed-content", fileName, initSectionIndex);
    },

    watcherSendUpdate(): Promise<void> {
        return ipcRenderer.invoke("watcher-send-update");
    },

    deleteFile(fileName: string): Promise<void> {
        return ipcRenderer.invoke("delete-file", fileName);
    },

    apiYandexgpt(prompt: string, yandexIamToken: string, yandexFolderId: string): Promise<string> {
        return ipcRenderer.invoke("api-yandexgpt", prompt, yandexIamToken, yandexFolderId);
    },
};

export type BookGridContextApi = typeof bookGridContext;

export default bookGridContext;
