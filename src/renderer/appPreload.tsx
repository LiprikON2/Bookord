import "~/misc/window/windowPreload";
import "~/main/mainPreload";

console.log("[Preload]: Execution started");

// Get versions
window.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    const { env } = process;
    const versions: Record<string, unknown> = {};

    // ERWT Package version
    versions["bookord"] = env["npm_package_version"];
    versions["license"] = env["npm_package_license"];

    // Process versions
    for (const type of ["chrome", "node", "electron"]) {
        versions[type] = process.versions[type].replace("+", "");
    }

    // Set versions to app data
    app.setAttribute("data-versions", JSON.stringify(versions));
});
