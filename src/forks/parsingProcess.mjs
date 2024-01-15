// @ts-check
// JSDoc docs: https://stackoverflow.com/a/42898969/10744339

import { mapInGroups, parseMetadata } from "./common/io.mjs";

console.info("[utilityProcess] was created");

process.parentPort.once(
    "message",
    /**
     * @param {Object} param
     * @param {Object} param.data
     * @param {string[]} param.data.filePaths
     * @param {Electron.MessagePortMain[]} param.ports
     */
    async ({ data, ports }) => {
        console.info("[utilityProcess] request received");

        const { filePaths } = data;

        const metadataEntries = await mapInGroups(filePaths, parseMetadata, 4);

        console.info("[utilityProcess] response sent");
        process.parentPort.postMessage(metadataEntries);
    }
);
