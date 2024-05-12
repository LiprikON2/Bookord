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

    handleOauthGiscus(callback: (giscusParam: string) => void) {
        const channel = "oauth-giscus";
        // Deliberately strip event as it includes `sender`
        const subscription = (event: Electron.IpcRendererEvent, giscusParam: any) =>
            callback(giscusParam);

        ipcRenderer.on(channel, subscription);
        console.info("[ipc]: subscription added:", channel);

        return () => {
            ipcRenderer.off(channel, subscription);
            console.info("[ipc]: subscription removed:", channel);
        };
    },
};

export type ThirdPartyApiContextApi = typeof thirdPartyApiContext;

export default thirdPartyApiContext;
