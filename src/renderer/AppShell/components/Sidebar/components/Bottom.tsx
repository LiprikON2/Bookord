import { Group } from "@mantine/core";
import React from "react";

import classes from "./Bottom.module.css";

export const Bottom = ({ children }: { children: React.ReactNode }) => {
    return <Group className={classes.root}>{children}</Group>;
};
