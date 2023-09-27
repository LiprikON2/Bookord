import { ipcRenderer } from "electron";

const windowControlsContext = {
    exit() {
        ipcRenderer.invoke("window-close");
    },
    undo() {
        ipcRenderer.invoke("web-undo");
    },
    redo() {
        ipcRenderer.invoke("web-redo");
    },
    cut() {
        ipcRenderer.invoke("web-cut");
    },
    copy() {
        ipcRenderer.invoke("web-copy");
    },
    paste() {
        ipcRenderer.invoke("web-paste");
    },
    delete() {
        ipcRenderer.invoke("web-delete");
    },
    selectAll() {
        ipcRenderer.invoke("web-select-all");
    },
    reload() {
        ipcRenderer.invoke("web-reload");
    },
    forceReload() {
        ipcRenderer.invoke("web-force-reload");
    },
    toggleDevtools() {
        ipcRenderer.invoke("web-toggle-devtools");
    },
    actualSize() {
        ipcRenderer.invoke("web-actual-size");
    },
    zoomIn() {
        ipcRenderer.invoke("web-zoom-in");
    },
    zoomOut() {
        ipcRenderer.invoke("web-zoom-out");
    },
    toggleFullscreen() {
        ipcRenderer.invoke("web-toggle-fullscreen");
    },
    minimize() {
        ipcRenderer.invoke("window-minimize");
    },
    toggleMaximize() {
        ipcRenderer.invoke("window-toggle-maximize");
    },
    openUrl(url: string) {
        ipcRenderer.invoke("open-url", url);
    },
};

export type WindowControlsContextApi = typeof windowControlsContext;

export default windowControlsContext;
