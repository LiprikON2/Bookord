import { app, BrowserWindow, session } from "electron";
import path from "path";
import { registerTitlebarIpc } from "~/misc/window/titlebarIPC";

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_WEBPACK_ENTRY: string;
declare const APP_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let appWindow: BrowserWindow;

/**
 * Create Application Window
 * @returns {BrowserWindow} Application Window Instance
 */
export const createAppWindow = (): BrowserWindow => {
    // Create new window instance
    appWindow = new BrowserWindow({
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
    appWindow.webContents.setVisualZoomLevelLimits(1, 3);

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
    appWindow.loadURL(APP_WINDOW_WEBPACK_ENTRY);

    // Show window when its ready to
    appWindow.on("ready-to-show", () => appWindow.show());

    // Register Inter Process Communication for main process
    registerMainIPC();

    // Close all windows when main window is closed
    appWindow.on("close", () => {
        appWindow = null;
        app.quit();
    });

    return appWindow;
};

/**
 * Register Inter Process Communication
 */
const registerMainIPC = () => {
    /**
     * Here you can assign IPC related codes for the application window
     * to Communicate asynchronously from the main process to renderer processes.
     */
    registerTitlebarIpc(appWindow);
};
