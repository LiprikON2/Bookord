import { app, BrowserWindow, session } from "electron";
import path from "path";

import { isDev } from "~/common/helpers";
import { registerTitlebarIpc } from "~/misc/window/titlebarIpc";
import { registerMainIpc } from "./mainIpc";
import electronDebug from "electron-debug";

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_WEBPACK_ENTRY: string;
declare const APP_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let mainWindow: BrowserWindow;

/**
 * Create Application Window
 * @returns {BrowserWindow} Application Window Instance
 */
export const createMainWindow = (): BrowserWindow => {
    // Create new window instance
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 728,
        minHeight: 500,
        minWidth: 500,
        backgroundColor: "#202020",
        show: false,
        autoHideMenuBar: true,
        frame: false,
        titleBarStyle: "hidden",
        icon: path.resolve("assets/images/appIcon.ico"),
        webPreferences: {
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            contextIsolation: true,
            sandbox: false,
            preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    // Enable pinch-to-zoom
    mainWindow.webContents.setVisualZoomLevelLimits(1, 3);

    // Permissions API
    const partition = "default";
    session
        .fromPartition(partition) /* eng-disable PERMISSION_REQUEST_HANDLER_JS_CHECK */
        .setPermissionRequestHandler((webContents, permission, permCallback) => {
            const allowedPermissions: string[] = []; // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

            if (allowedPermissions.includes(permission)) {
                permCallback(true); // Approve permission request
            } else {
                console.error(
                    `The application tried to request permission for '${permission}'. This permission was not whitelisted and has been blocked.`
                );

                permCallback(false); // Deny
            }
        });
    // TODO i18nextMainBackend
    // TODO electronegativity

    // Load the index.html of the app window.
    mainWindow.loadURL(APP_WINDOW_WEBPACK_ENTRY);

    // Show window when its ready to
    mainWindow.on("ready-to-show", () => {
        mainWindow.maximize();
        mainWindow.focus();
        !isDev() && mainWindow.show();
    });

    // Only do these things when in development
    if (isDev()) {
        // Errors are thrown if the dev tools are opened
        // before the DOM is ready
        mainWindow.webContents.once("dom-ready", async () => {
            // Provides dev tools shortcuts
            electronDebug();
            mainWindow.webContents.openDevTools();
        });
    }

    // Register Inter Process Communication for main process
    registerAllIpc();

    // Close all windows when main window is closed
    mainWindow.on("close", () => {
        mainWindow = null;
        app.quit();
    });

    return mainWindow;
};

/**
 * Register Inter Process Communication
 */
const registerAllIpc = () => {
    /**
     * Here you can assign IPC related codes for the application window
     * to Communicate asynchronously from the main process to renderer processes.
     */
    registerTitlebarIpc(mainWindow);
    registerMainIpc(mainWindow);
};
