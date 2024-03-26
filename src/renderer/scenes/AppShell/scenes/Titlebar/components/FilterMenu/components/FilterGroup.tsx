import React, { useState } from "react";
import { Badge, CloseButton, Menu, ScrollArea, Stack, TextInput, rem } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";

import { ToggleButton } from "~/renderer/components";
import { useFilterable } from "../hooks";
import classes from "./FilterGroup.module.css";

export type FilterGroupProps = {
    label: string;
    items: { [key: string]: number };
    setItem: (label: string, item: string, value: boolean) => void;
    itemsState:
        | {
              [itemKey: string]: boolean;
          }
        | undefined;
    className: string;
};

export const FilterGroup = ({ label, items, setItem, itemsState, ...rest }: FilterGroupProps) => {
    const [searchTermValue, setSearchTermValue] = useState("");
    const [debouncedSearchTerm] = useDebouncedValue(searchTermValue, 50, { leading: true });

    const filteredEntries = useFilterable(items, debouncedSearchTerm);

    return (
        <Stack gap={rem(4)}>
            <Menu.Label p={0}>
                <TextInput
                    value={searchTermValue}
                    onChange={(e) => setSearchTermValue(e.currentTarget.value)}
                    variant="subtle"
                    placeholder={label}
                    size="xs"
                    px="xs"
                    rightSectionPointerEvents={searchTermValue ? "auto" : "none"}
                    rightSection={
                        searchTermValue ? (
                            <CloseButton
                                variant="transparent"
                                size="sm"
                                onClick={() => setSearchTermValue("")}
                            />
                        ) : (
                            <IconSearch className={classes.icon} strokeWidth={1} />
                        )
                    }
                />
            </Menu.Label>
            <ScrollArea
                type="auto"
                scrollbars="y"
                w="100%"
                offsetScrollbars
                scrollbarSize={6}
                px={rem(2)}
                classNames={{ viewport: classes.viewport, thumb: classes.thumb }}
            >
                <Stack gap={rem(4)}>
                    {filteredEntries.map(([item, { value, visible }]) => (
                        <Menu.Item
                            style={{ opacity: visible ? "1" : "0.5" }}
                            key={item}
                            title={item}
                            renderRoot={(props) => (
                                <ToggleButton
                                    disabled={!visible}
                                    {...props}
                                    px={rem(8)}
                                    py={rem(4)}
                                    pr={rem(4)}
                                    classNames={{
                                        root: classes.root,
                                        inner: classes.inner,
                                    }}
                                    size="xs"
                                    justify="space-between"
                                    rightSection={
                                        <Badge size="sm" radius="sm" variant="default">
                                            {value}
                                        </Badge>
                                    }
                                    onClick={(on) => setItem(label, item, on)}
                                    on={itemsState?.[item] ?? false}
                                />
                            )}
                        >
                            {item}
                        </Menu.Item>
                    ))}
                </Stack>
            </ScrollArea>
        </Stack>
    );
};
