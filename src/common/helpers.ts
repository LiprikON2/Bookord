/**
 * Checks if process NODE_ENV in 'development' mode
 */
export function isDev(): boolean {
    return process.env.NODE_ENV == "development";
}
