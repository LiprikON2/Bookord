import { ipcRenderer } from "electron";

const thirdPartyApiContext = {
    apiYandexgpt(prompt: string, yandexIamToken: string, yandexFolderId: string): Promise<string> {
        return ipcRenderer.invoke("api-yandexgpt", prompt, yandexIamToken, yandexFolderId);
    },

    apiDeepl(text: string, targetLang: string, apiKey: string): Promise<string> {
        return ipcRenderer.invoke("api-deepl", text, targetLang, apiKey);
    },
    apiDictionary(text: string, targetLang: string): Promise<string> {
        return ipcRenderer.invoke("api-dictionary", text, targetLang);
    },
};

export type ThirdPartyApiContextApi = typeof thirdPartyApiContext;

export default thirdPartyApiContext;
