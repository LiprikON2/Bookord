import React from "react";
import { ActionIcon } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";

import { useColorScheme } from "~/renderer/hooks";
import classes from "./ThemeToggle.module.css";

export const ThemeToggle = observer(() => {
    const { setColorScheme, dark } = useColorScheme();
    return (
        <ActionIcon
            onClick={() => setColorScheme(dark ? "light" : "dark")}
            variant="default"
            aria-label="Toggle color scheme"
            h="100%"
            w="auto"
            style={{ aspectRatio: "1 / 1" }}
            size="lg"
        >
            <IconSun className={clsx(classes.icon, classes.light)} stroke={1.5} />
            <IconMoon className={clsx(classes.icon, classes.dark)} stroke={1.5} />
        </ActionIcon>
    );
});
