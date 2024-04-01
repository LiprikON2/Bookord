import { ipcRenderer } from "electron";

import { type BookMetadata } from "..";

const storeContext = {
    getParsedMetadata(fileNames: string[]): Promise<[string, BookMetadata][]> {
        return ipcRenderer.invoke("get-parsed-metadata", fileNames);
    },

    getParsedContent(fileName: string, initSectionIndex: number): Promise<void> {
        return ipcRenderer.invoke("get-parsed-content", fileName, initSectionIndex);
    },

    watcherSendUpdate(): Promise<void> {
        return ipcRenderer.invoke("watcher-send-update");
    },
};

export type StoreContextApi = typeof storeContext;

export default storeContext;
