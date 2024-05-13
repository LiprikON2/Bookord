import { app, BrowserWindow, dialog, session, shell } from "electron";
import { createMainWindow, mainWindow } from "./mainWindow";

import { getCustomProtocol, handleOauth, registerCustomProtocol } from "./utils";

// Electron Forge automatically creates it
declare const APP_WINDOW_WEBPACK_ENTRY: string;

// Continue the cargo cult!
// ref: https://github.com/desktop/desktop/blob/development/app/src/main-process/main.ts

/** Handle creating/removing shortcuts on Windows when installing/uninstalling. */
if (require("electron-squirrel-startup")) app.quit();

registerCustomProtocol();

// ref: https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
if (process.platform !== "darwin") {
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
        app.quit();
    } else {
        app.on("second-instance", (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.focus();
            }
            const url = commandLine.pop();
            handleOauth(url);
        });

        /**
         * This method will be called when Electron has finished
         * initialization and is ready to create browser windows.
         * Some APIs can only be used after this event occurs.
         */
        app.on("ready", createMainWindow);
    }
} else {
    /**
     * This method will be called when Electron has finished
     * initialization and is ready to create browser windows.
     * Some APIs can only be used after this event occurs.
     */
    app.on("ready", createMainWindow);

    // Handle the protocol on macos.
    app.on("open-url", (event, url) => handleOauth(url));
}

/**
 * Emitted when the application is activated. Various actions can
 * trigger this event, such as launching the application for the first time,
 * attempting to re-launch the application when it's already running,
 * or clicking on the application's dock or taskbar icon.
 */
app.on("activate", () => {
    /**
     * On OS X it's common to re-create a window in the app when the
     * dock icon is clicked and there are no other windows open.
     */
    if (process.platform === "darwin" && BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

app.on("web-contents-created", (event, contents) => {
    const whitelist = [
        "giscus.app",
        "github.com",
        "guides.github.com",
        "oauth.yandex.com",
        "yandex.cloud",
    ];
    /**
     * URL navigation
     * https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
     */
    contents.on("will-navigate", (contentsEvent, navigationUrl) => {
        console.log("\nAttempted to navigate to url:", navigationUrl, "\n");

        const url = new URL(navigationUrl);

        if (url.hostname === "giscus.app") {
            // Change giscus' redirect param to deep link to the app
            url.searchParams.set("redirect_uri", getCustomProtocol());
            contentsEvent.preventDefault();
        }

        if (whitelist.includes(url.hostname)) shell.openExternal(url.toString());
        contentsEvent.preventDefault();
    });

    /**
     * URL redirect
     * https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
     */
    contents.on("will-redirect", (contentsEvent, navigationUrl) => {
        console.log("\nAttempted to redirect to url:", navigationUrl, "\n");
        contentsEvent.preventDefault();
    });

    /**
     * New window creation
     * https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
     */
    contents.setWindowOpenHandler(({ url }) => {
        console.log("\nAttempted to open url in a new window:", url, "\n");

        const domain = new URL(url).hostname;

        if (whitelist.includes(domain)) shell.openExternal(url);

        return { action: "deny" };
    });

    /**
     * Webview creation
     * https://www.electronjs.org/docs/latest/tutorial/security#12-verify-webview-options-before-creation
     */
    contents.on("will-attach-webview", (event, webPreferences, params) => {
        console.log("\nAttempted to create webview\n");
        event.preventDefault();
    });

    /**
     * CORS whitelist
     * https://stackoverflow.com/a/69762776/10744339
     */
    session.defaultSession.webRequest.onHeadersReceived(
        // https://texttospeech.responsivevoice.org/
        {
            urls: ["*://*.responsivevoice.org/*", "*://giscus.app/*"],
        },
        (details, callback) => {
            const domain = new URL(details.url).hostname;
            console.log("onHeadersReceived", domain);

            if (domain === "giscus.app") {
                // TODO handle gicus header `frame-ancestors * null` properly
                console.log("deleting csp for giscus");
                delete details.responseHeaders["content-security-policy"];
                // details.responseHeaders["Content-Security-Policy"] = [
                //     new URL(APP_WINDOW_WEBPACK_ENTRY).host,
                // ];
            } else {
                details.responseHeaders["Access-Control-Allow-Origin"] = [
                    new URL(APP_WINDOW_WEBPACK_ENTRY).host,
                ];
            }

            callback({ responseHeaders: details.responseHeaders });
        }
    );
});

/**
 * Emitted when all windows have been closed.
 */
app.on("window-all-closed", () => {
    /**
     * On OS X it is common for applications and their menu bar
     * to stay active until the user quits explicitly with Cmd + Q
     */
    if (process.platform !== "darwin") {
        app.quit();
    }
});

/**
 * In this file you can include the rest of your app's specific main process code.
 * You can also put them in separate files and import them here.
 */

/**
 * Text-to-Speech support on linux
 *
 * ref: https://github.com/electron/electron/issues/4452#issuecomment-183471146
 */
app.commandLine.appendSwitch("enable-speech-dispatcher");
app.commandLine.appendSwitch("enable-speech-synthesis");
