import { TitlebarContextApi } from "./titlebarContext";

const context: TitlebarContextApi = window.electron_window?.titlebar;

export default context;
