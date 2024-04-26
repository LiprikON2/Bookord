import { app, BrowserWindow } from "electron";
import { createMainWindow } from "./mainWindow";

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
