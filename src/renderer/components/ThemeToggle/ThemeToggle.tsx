import React from "react";
import { ActionIcon } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import clsx from "clsx";

import { useColorScheme } from "~/renderer/hooks";
import classes from "./ThemeToggle.module.css";

export const ThemeToggle = () => {
    const { setColorScheme, dark } = useColorScheme();
    return (
        <ActionIcon
            onClick={() => setColorScheme(dark ? "light" : "dark")}
            variant="default"
            aria-label="Toggle color scheme"
            // p="md"
        >
            <IconSun className={clsx(classes.icon, classes.light)} stroke={1.5} />
            <IconMoon className={clsx(classes.icon, classes.dark)} stroke={1.5} />
        </ActionIcon>
    );
};
