import { ipcRenderer } from "electron";

const appContext = {
    test() {
        ipcRenderer.invoke("test");
    },
};

export type AppContextApi = typeof appContext;

export default appContext;
