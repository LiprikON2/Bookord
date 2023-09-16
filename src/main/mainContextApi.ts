import { type MainContextApi } from "./mainContext";

const context: MainContextApi = window.electron_main?.main;

export default context;
