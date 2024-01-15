import { ipcRenderer } from "electron";

const bookGridContext = {
    uploadFiles(files: FileObj[]): Promise<number> {
        return ipcRenderer.invoke("upload-files", files);
    },
    openFileDialog() {
        return ipcRenderer.invoke("open-file-dialog");
    },
};

export type BookGridContextApi = typeof bookGridContext;

export default bookGridContext;
