import { ipcRenderer } from "electron";

import type { BookContent, BookKey, BookMetadata } from "../..";

export type InitContentEvent = {
    bookKey: BookKey;
    initContent: BookContent;
};
export type SectionContentEvent = {
    bookKey: BookKey;
    sectionIndex: number;
    section: ArrayElement<BookContent["sections"]>;
};

const storeContext = {
    getParsedMetadata(fileNames: string[]): Promise<[string, BookMetadata][]> {
        return ipcRenderer.invoke("get-parsed-metadata", fileNames);
    },

    getParsedContent(fileName: string, initSectionIndex: number): Promise<void> {
        return ipcRenderer.invoke("get-parsed-content", fileName, initSectionIndex);
    },

    handleParsedContentInit(callback: (initContentEvent: InitContentEvent) => void) {
        const channel = "parsed-content-init";
        // Deliberately strip event as it includes `sender`
        const subscription = (event: Electron.IpcRendererEvent, initContentEvent: any) =>
            callback(initContentEvent);

        ipcRenderer.on(channel, subscription);
        console.info("[ipc]: subscription added:", channel);

        return () => {
            ipcRenderer.off(channel, subscription);
            console.info("[ipc]: subscription removed:", channel);
        };
    },
    handleParsedContentSection(callback: (sectionContentEvent: SectionContentEvent) => void) {
        const channel = "parsed-content-section";
        // Deliberately strip event as it includes `sender`
        const subscription = (event: Electron.IpcRendererEvent, sectionContentEvent: any) =>
            callback(sectionContentEvent);

        ipcRenderer.on(channel, subscription);
        console.info("[ipc]: subscription added:", channel);

        return () => {
            ipcRenderer.off(channel, subscription);
            console.info("[ipc]: subscription removed:", channel);
        };
    },
};

export type StoreContextApi = typeof storeContext;

export default storeContext;
