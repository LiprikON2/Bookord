import { ipcRenderer } from "electron";

const bookGridContext = {
    uploadFiles(files: FileObj[]) {
        return ipcRenderer.invoke("upload-files", files);
    },
};

export type BookGridContextApi = typeof bookGridContext;

export default bookGridContext;
