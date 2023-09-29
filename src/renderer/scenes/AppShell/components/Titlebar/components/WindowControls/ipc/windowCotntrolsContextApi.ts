import { WindowControlsContextApi } from "./windowControlsContext";

const context: WindowControlsContextApi = window.electron_window?.windowControls;

export default context;
