import { app, BrowserWindow, session } from "electron";
import electronDebug from "electron-debug";
import path from "path";

import { isDev } from "~/common/helpers";
import { registerMainIpc } from "./mainIpc";
import {
    registerThirdPartyApiIpc,
    registerWindowControlsIpc,
    registerStoreIpc,
    registerFileOperationsIpc,
} from "~/renderer/appIpc";
import io, { Watcher } from "./utils";

export const appDir = path.resolve(app.getPath("userData"), "Books");

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_WEBPACK_ENTRY: string;
declare const APP_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export type MainWindow = BrowserWindow & { watcher?: Watcher };

export let mainWindow: MainWindow;

/**
 * Create Application Window
 * @returns {MainWindow} Application Window Instance
 */
export const createMainWindow = async (): Promise<MainWindow> => {
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
        icon: path.resolve("assets/icons/platforms/bookord-circle@4x.png"),
        webPreferences: {
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            nodeIntegrationInSubFrames: false,
            contextIsolation: true,
            preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
            // TODO consider process sandboxing
            // https://www.electronjs.org/docs/latest/tutorial/sandbox
            sandbox: false,
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

    // TODO consider i18nextMainBackend
    // TODO consider electronegativity

    // Load the index.html of the app window.
    mainWindow.loadURL(APP_WINDOW_WEBPACK_ENTRY);

    // Show window when its ready to
    mainWindow.on("ready-to-show", () => {
        mainWindow.show();
        if (!isDev()) {
            mainWindow.maximize();
            mainWindow.focus();
        }
    });

    // Only do these things when in development
    if (isDev()) {
        // Errors are thrown if the dev tools are opened
        // before the DOM is ready
        mainWindow.webContents.once("dom-ready", async () => {
            // Provides dev tools shortcuts
            // TODO supress dev tools hmr errors
            electronDebug();
            mainWindow.webContents.openDevTools();
        });
    }

    // Register Inter Process Communication for main process
    registerAllIpc();

    const watcher = new io.Watcher(appDir, mainWindow);
    mainWindow.watcher = watcher;

    // Close all windows when main window is closed
    mainWindow.on("close", async () => {
        watcher.close().then(
            () => {
                console.info("[watcher]: closed");

                mainWindow = null;
                app.quit();
            },
            () => {
                console.error("[watcher]: failed to close");

                mainWindow = null;
                app.quit();
            }
        );
    });

    return mainWindow;
};

const allowedOrigins = [new URL(APP_WINDOW_WEBPACK_ENTRY).host];
/**
 * IPC message sender validation
 * https://www.electronjs.org/docs/latest/tutorial/security#17-validate-the-sender-of-all-ipc-messages
 */
const validateSender = (event: Electron.IpcMainInvokeEvent) => {
    const { url } = event.senderFrame;
    const host = new URL(url).host;
    if (allowedOrigins.includes(host)) return true;

    return false;
};

/**
 * Register Inter Process Communication
 */
const registerAllIpc = () => {
    /**
     * Here you can assign IPC related codes for the application window
     * to Communicate asynchronously from the main process to renderer processes.
     */
    registerMainIpc(mainWindow, validateSender);
    registerWindowControlsIpc(mainWindow, validateSender);
    registerStoreIpc(mainWindow, validateSender);
    registerThirdPartyApiIpc(mainWindow, validateSender);
    registerFileOperationsIpc(mainWindow, validateSender);
};
