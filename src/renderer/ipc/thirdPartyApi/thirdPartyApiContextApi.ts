import { ThirdPartyApiContextApi } from "./thirdPartyApiContext";

const context: ThirdPartyApiContextApi = window.electron_window?.thirdPartyApi;

export default context;
