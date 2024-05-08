import React from "react";
import { Text, Image } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { icons, type Icon } from "~/renderer/components";
import { useVersions } from "./hooks";
import classes from "./Item.module.css";

export const Item = observer(
    ({ type, name, version }: { type: Icon; name?: string; version?: string }) => {
        const [versions] = useVersions();

        return (
            <div className={classes.container}>
                <div>
                    <Image className={classes.icon} src={icons[type]} />
                    <Text style={{ textTransform: "capitalize" }}>{name ?? type}</Text>
                </div>
                <Text ta="right" c="dimmed">
                    {version ?? versions?.[type]}
                </Text>
            </div>
        );
    }
);
