// @ts-check

import _ from "lodash";
import path from "path";
import fs from "fs-extra";
import os from "os";
import chokidar from "chokidar";
import { parseEpub } from "@liprikon/epub-parser";

export const makeSuccess = () => {
    return _.upperCase("success 2");
};

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

export const parseMetadata = async (/** @type {string} */ filePath) => {
    const filename = path.parse(filePath).base;
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
    try {
        const { info: bookMetadata } = await parseEpub(filePath);
        return [filename, Object.assign({}, baseBookMetadata, bookMetadata)];
    } catch (error) {
        console.log("[utilityProcess] error parsing epub:", error);
        return [filename, baseBookMetadata];
    }
};
