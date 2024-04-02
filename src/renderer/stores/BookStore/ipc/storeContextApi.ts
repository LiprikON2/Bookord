import { StoreContextApi } from "./storeContext";

const context: StoreContextApi = window.electron_window?.store;

export default context;
