// @ts-check

import _ from "lodash";
import path from "path";
import { parseEpub } from "@liprikon/epub-parser";
import nlp from "compromise";

// @ts-ignore
export const mapInGroups = (arr, iteratee, groupSize) => {
    // @ts-ignore
    const groups = _.groupBy(arr, (_v, i) => Math.floor(i / groupSize));

    return Object.values(groups).reduce(
        // @ts-ignore
        async (memo, group) => [...(await memo), ...(await Promise.all(group.map(iteratee)))],
        []
    );
};

const baseBookMetadata = {
    title: "",
    indentifiers: "",
    languages: "",
    relations: "",
    subjects: "",
    publishers: "",
    contributors: "",
    coverages: "",
    rights: "",
    sources: "",
    description: "",
    date: "",
    cover: "",
    author: "",
};

export const parseMetadata = async (/** @type {string} */ filePath) => {
    const filename = path.parse(filePath).base;
    try {
        const { info: bookMetadata } = await parseEpub(filePath);
        return [filename, { ...baseBookMetadata, ...bookMetadata }];
    } catch (error) {
        console.log("[utilityProcess io] error parsing epub:", error);
        return [filename, baseBookMetadata];
    }
};

export const parseContent = async (
    /** @type {string} */ filePath,
    /** @type {number} */ initSectionIndex
) => {
    let parsedEpub;
    try {
        parsedEpub = await parseEpub(filePath);
    } catch (error) {
        console.log("[utilityProcess io] error parsing epub:", error);
        // TODO handle errors
    }

    const initSections = parsedEpub.sections.map((unparsedSection, index) => ({
        id: unparsedSection.id,
        content: index === initSectionIndex ? unparsedSection.toHtmlObjects() : null,
    }));
    const initContent = {
        styles: parsedEpub.styles,
        structure: parsedEpub.structure,
        sections: initSections,
    };
    return { initContent, unparsedSections: parsedEpub.sections };
};

export const parseSections = async (
    /** @type {any} */ unparsedSections,
    /** @type {any} */ initSections
) => {
    /* Algo 1 */
    // const sections = await mapInGroups(
    //     unparsedSections,
    //     async (/** @type {any} */ section) => section.toHtmlObjects(),
    //     4
    // );

    /* Algo 2 */
    const sections = await mapInGroups(
        unparsedSections,
        async (/** @type {any} */ unparsedSection, /** @type {number} */ index) => {
            const isUnparsed = initSections[index].content === null;
            if (isUnparsed)
                return { ...initSections[index], content: unparsedSection.toHtmlObjects() };
            return initSections[index];
        },
        4
    );

    /* Algo 3 (baseline) */
    // const sections = unparsedSections.map((/** @type {any} */ section) => section.toHtmlObjects());

    return sections;
};

/** Offset
 * @typedef {Object} Offset
 * @property {number} index
 * @property {number} start
 * @property {number} length
 * @property {string} string
 * @property {number} trimmedStart
 * @property {number} trimmedLength
 * @property {string} trimmedString
 * @property {string} context
 *
 */

/**
 * Removes leading and trailing whitespaces or punctuations ("Ann..." or "Ann " -> "Ann")
 * @param {string} str
 * @returns
 */
const removeLeadingAndTrailingPunctuation = (str) => {
    return str.replace(/^[\W_]+|[\W_]+$/g, "");
};

/**
 * Removes leading whitespaces or punctuations ("Ann..." or "Ann " -> "Ann")
 * @param {string} str
 * @returns
 */
const removeLeadingPunctuation = (str) => {
    return str.replace(/^[\W_]+/, "");
};

/**
 * https://observablehq.com/@spencermountain/topics-named-entity-recognition
 * https://observablehq.com/@spencermountain/compromise-normalization
 * @param {string} text
 * @param {number} contextRange number of sentences in a context for a duplicate name
 * @returns
 */
export const findPeople = (text, contextRange = 3) => {
    /** @type {any} */
    const doc = nlp(text).normalize({ unicode: true });

    /** @type {string[]} */
    const uniqueNames = [];

    /** @type {{[key: string]: string}} */
    const displayNames = {};

    /** @type {{[key: string]: Offset[]}} */
    const nameOffsets = {};

    const peopleJson = doc.people().json({ normal: true, offset: true, index: true });

    const sentences = doc.sentences().out("array");
    peopleJson.forEach(
        (/** @type {{text: string; offset: Offset; normal: string; terms: any}} */ json) => {
            const { text: displayName, normal, offset } = json;

            const sentenceIndex = json.terms[0].index[0];
            const startContext = Math.max(0, sentenceIndex - Math.round(contextRange / 2) + 1);
            const endContext = Math.min(sentences.length, startContext + contextRange);
            const context = sentences.slice(startContext, endContext).join(" ");

            const trimmedNormal = removeLeadingAndTrailingPunctuation(
                nlp(normal)
                    .normalize({
                        punctuation: true,
                        possessives: true,
                    })
                    .out("text")
            );
            const trimmedDisplayName = removeLeadingAndTrailingPunctuation(
                nlp(displayName)
                    .normalize({
                        punctuation: true,
                        possessives: true,
                    })
                    .out("text")
            );

            const string = text.slice(offset.start, offset.start + offset.length);

            const trimmedStart =
                offset.start + (string.length - removeLeadingPunctuation(string).length);
            const trimmedString = removeLeadingAndTrailingPunctuation(string);

            const processedOffset = {
                ...offset,
                string,
                trimmedStart,
                trimmedString,
                trimmedLength: trimmedString.length,
                sentenceIndex,
                context,
                // TEST_SENTENCE: sentences[sentenceIndex],
                // CONTEXT_RANGE: [startContext, endContext],
            };

            if (!uniqueNames.includes(trimmedNormal)) {
                uniqueNames.push(trimmedNormal);
                nameOffsets[trimmedNormal] = [processedOffset];
                displayNames[trimmedNormal] = trimmedDisplayName;
            } else {
                nameOffsets[trimmedNormal].push(processedOffset);
            }
        }
    );

    const people = {
        uniqueNames,
        nameOffsets,
        displayNames,
    };

    return people;
};
