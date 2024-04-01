import { FileOperationsContextApi } from "./fileOperationsContext";

const context: FileOperationsContextApi = window.electron_window?.fileOperations;

export default context;
