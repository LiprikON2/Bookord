import { Group } from "@mantine/core";
import React from "react";
import { observer } from "mobx-react-lite";

import classes from "./Bottom.module.css";

export const Bottom = observer(({ children }: { children: React.ReactNode }) => {
    return (
        <Group className={classes.root} mt="xs">
            {children}
        </Group>
    );
});
