import React from "react";
import { Badge, Menu, Stack, rem } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { ToggleButton } from "~/renderer/components";
import { Tag, TagName } from "~/renderer/stores";
import classes from "./Tags.module.css";

interface TagsProps {
    getTags: () => Tag[];
    onTagToggle: (name: TagName, on: boolean) => void;
}

export const Tags = observer(({ getTags, onTagToggle }: TagsProps) => {
    const tags = getTags();
    return (
        <Stack gap={rem(4)}>
            {tags.map(({ name, active, visible, count }) => (
                <Menu.Item
                    style={{ opacity: visible ? "1" : "0.5" }}
                    key={name}
                    title={name}
                    renderRoot={(props) => (
                        <ToggleButton
                            disabled={!visible}
                            {...props}
                            px={8}
                            py={4}
                            pr={4}
                            classNames={{
                                root: classes.root,
                                inner: classes.inner,
                            }}
                            size="xs"
                            justify="space-between"
                            rightSection={
                                <Badge size="sm" radius="sm" variant="default">
                                    {count}
                                </Badge>
                            }
                            onClick={(on) => onTagToggle(name, on)}
                            on={active}
                        />
                    )}
                >
                    {name}
                </Menu.Item>
            ))}
            {!tags.length && <Menu.Item disabled={true}>No tags...</Menu.Item>}
        </Stack>
    );
});
