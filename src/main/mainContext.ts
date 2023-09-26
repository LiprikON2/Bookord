import { ipcRenderer } from "electron";

const mainContext = {
    test(): Promise<string> {
        return ipcRenderer.invoke("test");
    },
};

export type MainContextApi = typeof mainContext;

export default mainContext;
