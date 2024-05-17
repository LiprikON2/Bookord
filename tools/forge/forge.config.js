// Forge Configuration
const path = require("path");
const rootDir = process.cwd();

module.exports = {
    // Packager Config
    packagerConfig: {
        // Create asar archive for main, renderer process files
        asar: true,
        // Set executable name
        name: "bookord",
        executableName: "Bookord",
        // Set application copyright
        appCopyright: "Copyright (C)",
        // Set application icon
        // - No extension required
        // - DPI suffix support: @1x, @1.25x, @1.33x, @1.4x, @1.5x, @1.8x, @2x, @2.5x, @3x, @4x, and @5x.
        // ref: https://www.electronforge.io/guides/create-and-add-icons
        icon: path.resolve("assets/icons/platforms/bookord-circle"),

        protocols: [
            {
                name: "Bookord",
                schemes: ["bookord"],
            },
        ],
    },
    // Forge Makers
    makers: [
        {
            // Squirrel.Windows is a no-prompt, no-hassle, no-admin method of installing
            // Windows applications and is therefore the most user friendly you can get.
            name: "@electron-forge/maker-squirrel",
            config: {
                name: "bookord",
                // An URL to an ICO file to use as the application icon (displayed in Control Panel > Programs and Features).
                iconUrl:
                    "https://raw.githubusercontent.com/LiprikON2/Bookord/master/assets/icons/platforms/bookord-square.ico",
                // The ICO file to use as the icon for the generated Setup.exe
                setupIcon: path.resolve("assets/icons/platforms/bookord-installer.ico"),
            },
        },
        {
            // The Zip target builds basic .zip files containing your packaged application.
            // There are no platform specific dependencies for using this maker and it will run on any platform.
            name: "@electron-forge/maker-zip",
            platforms: ["darwin", "linux"],
        },
        {
            name: "@electron-forge/maker-dmg",
            config: {
                name: "bookord",
            },
        },
        {
            // The deb target builds .deb packages, which are the standard package format for Debian-based
            // Linux distributions such as Ubuntu.
            // https://js.electronforge.io/interfaces/_electron_forge_maker_deb.InternalOptions.MakerDebConfigOptions.html
            name: "@electron-forge/maker-deb",
            config: {
                options: {
                    icon: path.resolve("assets/icons/platforms/bookord-circle@4x.png"),

                    // Same as productName
                    // ref: https://github.com/electron-userland/electron-installer-debian/issues/175#issuecomment-1558131497
                    bin: "Bookord",
                    mimeType: ["x-scheme-handler/bookord"],
                },
            },
        },
        {
            // The RPM target builds .rpm files, which is the standard package format for
            // RedHat-based Linux distributions such as Fedora.
            name: "@electron-forge/maker-rpm",
            config: {
                options: {
                    icon: path.resolve("assets/icons/platforms/bookord-circle@4x.png"),
                    bin: "Bookord",
                    mimeType: ["x-scheme-handler/bookord"],
                },
            },
        },
    ],

    publishers: [
        {
            name: "@electron-forge/publisher-github",
            // https://js.electronforge.io/interfaces/_electron_forge_publisher_github.PublisherGitHubConfig.html
            config: {
                repository: {
                    owner: "LiprikON2",
                    name: "Bookord",
                },
                tagPrefix: "v",
                draft: true,
                prerelease: false,
                force: true,
            },
        },
    ],
    // Forge Plugins
    plugins: [
        {
            name: "@electron-forge/plugin-auto-unpack-natives",
            config: {},
        },
        {
            name: "@electron-forge/plugin-webpack",
            config: {
                // Fix content-security-policy error when image or video src isn't same origin
                // Remove 'unsafe-eval' to get rid of console warning in development mode.
                devContentSecurityPolicy: `default-src 'self' 'unsafe-inline' data: https://*.responsivevoice.org/ https://giscus.app/; script-src 'self' 'unsafe-inline' data: https://*.responsivevoice.org/ https://giscus.app/`,
                // Ports
                port: 3000, // Webpack Dev Server port
                loggerPort: 9000, // Logger port
                // Main process webpack configuration
                mainConfig: path.join(rootDir, "tools/webpack/webpack.main.js"),
                // Renderer process webpack configuration
                renderer: {
                    // Configuration file path
                    config: path.join(rootDir, "tools/webpack/webpack.renderer.js"),
                    // Entrypoints of the application
                    entryPoints: [
                        {
                            // Window process name
                            name: "app_window",
                            // React Hot Module Replacement (HMR)
                            rhmr: "react-hot-loader/patch",
                            // HTML index file template
                            html: path.join(rootDir, "src/renderer/app.html"),
                            // Renderer
                            js: path.join(rootDir, "src/renderer/appRenderer.tsx"),
                            // Main Window
                            // Preload
                            preload: {
                                js: path.join(rootDir, "src/renderer/appPreload.tsx"),
                            },
                        },
                    ],
                },
                devServer: {
                    liveReload: false,
                },
            },
        },
    ],
};
