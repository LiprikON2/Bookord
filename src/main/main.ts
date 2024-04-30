import { app, BrowserWindow, session } from "electron";
import { createMainWindow } from "./mainWindow";

// Electron Forge automatically creates it
declare const APP_WINDOW_WEBPACK_ENTRY: string;

// Continue the cargo cult!
// ref: https://github.com/desktop/desktop/blob/development/app/src/main-process/main.ts

/** Handle creating/removing shortcuts on Windows when installing/uninstalling. */
if (require("electron-squirrel-startup")) app.quit();

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.on("ready", createMainWindow);

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
    /**
     * URL navigation
     * https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
     */
    contents.on("will-navigate", (contentsEvent, navigationUrl) => {
        console.log("Attempted to navigate to url:", navigationUrl);
        contentsEvent.preventDefault();
    });

    /**
     * URL redirect
     * https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
     */
    contents.on("will-redirect", (contentsEvent, navigationUrl) => {
        console.log("Attempted to redirect to url:", navigationUrl);
        contentsEvent.preventDefault();
    });

    /**
     * New window creation
     * https://www.electronjs.org/docs/latest/tutorial/security#13-disable-or-limit-navigation
     */
    contents.setWindowOpenHandler(({ url }) => {
        console.log("Attempted to open url:", url);
        return { action: "deny" };
    });

    /**
     * Webview creation
     * https://www.electronjs.org/docs/latest/tutorial/security#12-verify-webview-options-before-creation
     */
    contents.on("will-attach-webview", (event, webPreferences, params) => {
        console.log("Attempted to create webview");
        event.preventDefault();
    });

    /**
     * CORS whitelist
     * https://stackoverflow.com/a/69762776/10744339
     */
    session.defaultSession.webRequest.onHeadersReceived(
        // https://texttospeech.responsivevoice.org/
        { urls: ["*://*.responsivevoice.org/*"] },
        (details, callback) => {
            details.responseHeaders["Access-Control-Allow-Origin"] = [
                new URL(APP_WINDOW_WEBPACK_ENTRY).host,
            ];
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
