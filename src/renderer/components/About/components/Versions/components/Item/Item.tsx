import React from "react";
import { Text, createStyles, useMantineColorScheme } from "@mantine/core";

import { icons, type Icon } from "./components/Icons";
import { useVersions } from "../../hooks";
import { useTheme } from "@emotion/react";

const useStyles = createStyles((theme) => ({
    container: {
        background: theme.colorScheme === "dark" ? "#191919" : "#fff",
        color: theme.colorScheme === "dark" ? "#d1d1d1" : "#656565",
        boxShadow: theme.colorScheme === "dark" ? "unset" : "0 2px 4px #00000005",
        width: "calc(50% - 1rem)",
        padding: "4px 12px",
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        margin: "0",
        boxSizing: "border-box",
        borderRadius: "4px",

        ["& > *"]: {
            display: "flex",
        },
    },
    icon: {
        width: "1.25rem",
        height: "1.25rem",
        marginRight: "0.625rem",
        opacity: 0.8,
    },
}));

export const Item = ({ type }: { type: Icon }) => {
    const { classes } = useStyles();
    const { colorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    const [versions] = useVersions();

    return (
        <div className={classes.container}>
            <div>
                <img className={classes.icon} src={icons[type]} />
                <Text style={{ textTransform: "capitalize" }}>{type}</Text>
            </div>
            <Text ta="right" c="dimmed">
                {versions?.[type]}
            </Text>
        </div>
    );
};
