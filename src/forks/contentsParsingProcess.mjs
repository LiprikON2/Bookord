// @ts-check
// JSDoc docs: https://stackoverflow.com/a/42898969/10744339

import { parseContents } from "./common/io.mjs";

console.info("[contentsParsingProcess] was created");

process.parentPort.once(
    "message",
    /**
     * @param {Object} param
     * @param {Object} param.data
     * @param {string} param.data.filePath
     * @param {Electron.MessagePortMain[]} param.ports
     */
    async ({ data, ports }) => {
        console.info("[contentsParsingProcess] request received");

        const { filePath } = data;

        const parsedBook = await parseContents(filePath, 0);

        console.info("[contentsParsingProcess] response sent");
        process.parentPort.postMessage(parsedBook);
    }
);
