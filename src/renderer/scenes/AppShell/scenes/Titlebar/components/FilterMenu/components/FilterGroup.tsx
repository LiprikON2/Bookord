import React, { useEffect, useState } from "react";
import { Badge, CloseButton, Menu, ScrollArea, Stack, TextInput, rem } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { ToggleButton } from "~/renderer/components";
import { FilterTags, useTags } from "~/renderer/stores";
import classes from "./FilterGroup.module.css";

export type FilterGroupProps = {
    tagCategory: keyof FilterTags;
};

export const FilterGroup = observer(({ tagCategory }: FilterGroupProps) => {
    const { setActiveTag, tags, setTagsSearchTerm, tagCategoryName } = useTags(tagCategory);

    const [searchTermValue, setSearchTermValue] = useState("");
    const [debouncedSearchTerm] = useDebouncedValue(searchTermValue, 50, { leading: true });

    useEffect(() => setTagsSearchTerm(debouncedSearchTerm), [debouncedSearchTerm]);

    return (
        <Stack gap={rem(4)}>
            <Menu.Label p={0}>
                <TextInput
                    value={searchTermValue}
                    onChange={(e) => setSearchTermValue(e.currentTarget.value)}
                    variant="subtle"
                    placeholder={tagCategoryName}
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
                px={2}
                classNames={{ viewport: classes.viewport, thumb: classes.thumb }}
            >
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
                                    onClick={(on) => setActiveTag(name, on)}
                                    on={active}
                                />
                            )}
                        >
                            {name}
                        </Menu.Item>
                    ))}
                    {!tags.length && <Menu.Item disabled={true}>No tags...</Menu.Item>}
                </Stack>
            </ScrollArea>
        </Stack>
    );
});
