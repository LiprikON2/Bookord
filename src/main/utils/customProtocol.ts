import { app } from "electron";
import path from "path";

export const registerCustomProtocol = () => {
    const appName = app.getName();

    if (process.defaultApp) {
        if (process.argv.length >= 2) {
            app.setAsDefaultProtocolClient(appName, process.execPath, [
                path.resolve(process.argv[1]),
            ]);
        }
    } else {
        app.setAsDefaultProtocolClient(appName);
    }
};

export const getCustomProtocol = () => {
    const appName = app.getName();
    return `${appName}://`;
};
