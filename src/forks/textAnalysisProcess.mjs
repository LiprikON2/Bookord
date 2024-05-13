// @ts-check
// JSDoc docs: https://stackoverflow.com/a/42898969/10744339
import { findPeople } from "./common/io.mjs";

console.info("[textAnalysisProcess] was created");

process.parentPort.once(
    "message",
    /**
     * @param {Object} param
     * @param {Object} param.data
     * @param {string} param.data.text
     * @param {Electron.MessagePortMain[]} param.ports
     */
    async ({ data, ports }) => {
        console.info("[textAnalysisProcess] request received");

        const { text } = data;
        const people = findPeople(text);

        process.parentPort.postMessage(people);
    }
);
