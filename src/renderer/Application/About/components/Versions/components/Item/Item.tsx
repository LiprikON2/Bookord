import React from "react";
import { Text } from "@mantine/core";

import { icons, type Icon } from "~/components/Icons";
import { useVersions } from "./hooks";
import classes from "./Item.module.css";

export const Item = ({ type }: { type: Icon }) => {
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
