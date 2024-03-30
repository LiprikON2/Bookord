// @ts-check
// JSDoc docs: https://stackoverflow.com/a/42898969/10744339

import { mapInGroups, parseMetadata } from "./common/io.mjs";

console.info("[metadataParsingProcess] was created");

process.parentPort.once(
    "message",
    /**
     * @param {Object} param
     * @param {Object} param.data
     * @param {string[]} param.data.filePaths
     * @param {Electron.MessagePortMain[]} param.ports
     */
    async ({ data, ports }) => {
        console.info("[metadataParsingProcess] request received");

        const { filePaths } = data;

        const metadataEntries = await mapInGroups(filePaths, parseMetadata, 4);

        console.info("[metadataParsingProcess] response sent");
        process.parentPort.postMessage(metadataEntries);
    }
);
