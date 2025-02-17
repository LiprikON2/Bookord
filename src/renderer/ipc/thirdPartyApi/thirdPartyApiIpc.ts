import { ipcMain } from "electron";
import axios from "axios";

import { MainWindow } from "~/main/mainWindow";

export const registerThirdPartyApiIpc = (
    mainWindow: MainWindow,
    validateSender: (e: Electron.IpcMainInvokeEvent) => boolean
) => {
    ipcMain.handle(
        "api-yandexgpt",
        (
            e,
            systemPrompt: string,
            userPrompt: string,
            yandexIamToken: string,
            yandexFolderId: string
        ) => {
            if (!validateSender(e)) return null;

            return axios
                .post(
                    "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
                    {
                        modelUri: `gpt://${yandexFolderId}/yandexgpt`,
                        completionOptions: {
                            stream: false,
                            temperature: 0.6,
                            maxTokens: "2000",
                        },
                        messages: [
                            {
                                role: "system",
                                text: systemPrompt,
                            },
                            {
                                role: "user",
                                text: userPrompt,
                            },
                        ],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${yandexIamToken}`,
                            "x-folder-id": yandexFolderId,
                        },
                    }
                )
                .then((res) => res.data.result.alternatives[0].message.text);
        }
    );

    ipcMain.handle("api-yandex-cloud-iam-auth", (e, oauth: string) => {
        if (!validateSender(e)) return null;

        return axios
            .post("https://iam.api.cloud.yandex.net/iam/v1/tokens", {
                yandexPassportOauthToken: oauth,
            })
            .then((res) => res.data.iamToken);
    }),
        ipcMain.handle("api-deepl", async (e, text: string, targetLang: string, apiKey: string) => {
            if (!validateSender(e)) return null;

            return axios
                .post(
                    "https://api-free.deepl.com/v2/translate",
                    {
                        text: [text],
                        target_lang: targetLang,
                    },
                    {
                        headers: {
                            Authorization: `DeepL-Auth-Key ${apiKey}`,
                            "Content-Type": "application/json",
                        },
                        validateStatus: (status) => {
                            return status < 500; // Resolve only if the status code is less than 500
                        },
                        timeout: 4000,
                    }
                )
                .then((res) => res.data.translations[0].text)
                .catch((error) => {
                    if (error.response) {
                        // The request was made and the server responded with a status code
                        // that falls out of the range of 2xx
                        return "Unknown";
                    } else if (error.request) {
                        // The request was made but no response was received
                        return "No response. Check your internet connection.";
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        return "Error. Did you enter correct DeepL API key in the settings?";
                    }
                });
        });

    // ref: https://stackoverflow.com/a/48983463/10744339
    ipcMain.handle("api-dictionary", async (e, text: string, targetLang: string) => {
        if (!validateSender(e)) return null;

        return axios
            .get(
                `https://api.dictionaryapi.dev/api/v2/entries/${targetLang}/${encodeURIComponent(
                    text
                )}`,
                {
                    validateStatus: (status) => {
                        return status < 500; // Resolve only if the status code is less than 500
                    },
                    timeout: 4000,
                }
            )
            .then((res) => res.data[0].meanings[0].definitions[0].definition)
            .catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    return "Unknown";
                } else if (error.request) {
                    // The request was made but no response was received
                    return "No response. Check your internet connection.";
                } else {
                    // Something happened in setting up the request that triggered an Error
                    return "Error";
                }
            });
    });
};
