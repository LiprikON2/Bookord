// @ts-check
// JSDoc docs: https://stackoverflow.com/a/42898969/10744339

import { parseContent } from "./common/io.mjs";

console.info("[contentsParsingProcess] was created");

process.parentPort.once(
    "message",
    /**
     * @param {Object} param
     * @param {Object} param.data
     * @param {string} param.data.filePath
     * @param {number} param.data.initSectionIndex
     * @param {Electron.MessagePortMain[]} param.ports
     */
    async ({ data, ports }) => {
        console.info("[contentsParsingProcess] request received");

        const { filePath, initSectionIndex } = data;

        const parsedBook = await parseContent(filePath, initSectionIndex);

        console.info("[contentsParsingProcess] response sent");
        process.parentPort.postMessage(parsedBook);
    }
);
