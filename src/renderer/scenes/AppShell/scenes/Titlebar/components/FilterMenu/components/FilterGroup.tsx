import { Badge, Group, Menu, ScrollArea, Stack, TextInput, rem } from "@mantine/core";
import React from "react";

import { ToggleButton } from "~/renderer/components";
import classes from "./FilterGroup.module.css";
import { IconSearch } from "@tabler/icons-react";

type FilterGroupProps = {
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
    return (
        <Stack gap={rem(4)}>
            <Menu.Label p={0}>
                {/* TODO variant="subtle", change typed text color */}
                <TextInput
                    variant="unstyled"
                    styles={{
                        root: {
                            "--input-height": "calc(var(--input-fz) * 1.5)",
                        },
                        input: { backgroundColor: "transparent" },
                    }}
                    placeholder={label}
                    size="xs"
                    px="xs"
                    rightSectionPointerEvents="none"
                    rightSection={<IconSearch className={classes.icon} strokeWidth={1} />}
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
                    {Object.entries(items).map(([item, count]) => (
                        <Menu.Item
                            key={item}
                            renderRoot={(props) => (
                                <ToggleButton
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
                                            {count}
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
