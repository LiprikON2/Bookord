// @ts-check

import _ from "lodash";
import path from "path";
import { parseEpub } from "@liprikon/epub-parser";

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

let baseBookMetadata = {
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
