import { ipcRenderer } from "electron";
import { type FSWatcher } from "chokidar";

const mainContext = {
    // test(): Promise<string> {
    //     return ipcRenderer.invoke("test");
    // },
};

export type MainContextApi = typeof mainContext;

export default mainContext;
