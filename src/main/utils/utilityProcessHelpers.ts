export const getResponse = (utilityProcess: Electron.UtilityProcess, toKillAfter = true) => {
    let promiseResolve: (value: unknown) => void;
    const promise = new Promise((resolve, reject) => (promiseResolve = resolve));

    utilityProcess.once("message", (res) => {
        console.info("[main] response received");
        promiseResolve(res);
        if (toKillAfter) utilityProcess.kill();
    });

    return promise;
};
