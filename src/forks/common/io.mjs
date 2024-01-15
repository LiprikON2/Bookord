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
