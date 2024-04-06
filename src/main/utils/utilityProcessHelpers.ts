export const getResponse = (
    utilityProcess: Electron.UtilityProcess,
    toKillAfter = true,
    id?: string
) => {
    let promiseResolve: (value: unknown) => void;
    const promise = new Promise((resolve, reject) => (promiseResolve = resolve));

    utilityProcess.on("message", (res) => {
        if (id && id !== res.id) return;

        console.info("[main] response received");
        promiseResolve(res);
        if (toKillAfter) utilityProcess.kill();
    });

    return promise;
};
