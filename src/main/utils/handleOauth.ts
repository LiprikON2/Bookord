import { mainWindow } from "../mainWindow";

export const handleOauth = (url: string) => {
    const giscusParam = new URLSearchParams(new URL(url).search).get("giscus");
    if (giscusParam) mainWindow.webContents.send("oauth-giscus", giscusParam);
};
