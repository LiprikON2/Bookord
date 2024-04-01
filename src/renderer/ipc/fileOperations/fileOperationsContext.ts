import { ipcRenderer } from "electron";

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
};

export type FileOperationsContextApi = typeof fileOperationsContext;

export default fileOperationsContext;
