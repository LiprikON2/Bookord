import { ipcRenderer } from "electron";

const thirdPartyApiContext = {
    apiYandexgpt(prompt: string, yandexIamToken: string, yandexFolderId: string): Promise<string> {
        return ipcRenderer.invoke("api-yandexgpt", prompt, yandexIamToken, yandexFolderId);
    },
};

export type ThirdPartyApiContextApi = typeof thirdPartyApiContext;

export default thirdPartyApiContext;
