import { ipcMain } from "electron";
import axios from "axios";
import { MainWindow } from "~/main/mainWindow";

export const registerThirdPartyApiIpc = (
    mainWindow: MainWindow,
    validateSender: (e: Electron.IpcMainInvokeEvent) => boolean
) => {
    ipcMain.handle(
        "api-yandexgpt",
        (e, prompt: string, yandexIamToken: string, yandexFolderId: string) => {
            if (!validateSender(e)) return null;

            return axios
                .post(
                    "https://llm.api.cloud.yandex.net/foundationModels/v1/completion",
                    {
                        modelUri: `gpt://${yandexFolderId}/yandexgpt-lite`,
                        completionOptions: {
                            stream: false,
                            temperature: 0.6,
                            maxTokens: "2000",
                        },
                        messages: [
                            {
                                role: "system",
                                text: prompt,
                            },
                        ],
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${yandexIamToken}`,
                            "x-folder-id": "yandexFolderId",
                        },
                    }
                )
                .then((res) => res.data.result.alternatives[0].message.text);
        }
    );
};
