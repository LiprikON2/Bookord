// @ts-check
// JSDoc docs: https://stackoverflow.com/a/42898969/10744339

console.info("[utilityProcess] was created");

process.parentPort.once(
    "message",
    /**
     * @param {Object} param
     * @param {Object} param.data
     * @param {FileObj[]} param.data.files
     * @param {Electron.MessagePortMain[]} param.ports
     */
    ({ data, ports }) => {
        console.info("[utilityProcess] request received");

        console.info("[utilityProcess] response sent");
        process.parentPort.postMessage(1);
    }
);
