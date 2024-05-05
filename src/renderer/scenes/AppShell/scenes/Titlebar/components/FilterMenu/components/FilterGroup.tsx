import React, { useEffect, useState } from "react";
import { Badge, CloseButton, Menu, ScrollArea, Stack, TextInput, rem } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { ToggleButton } from "~/renderer/components";
import { FilterTags, useBookViewStore, useTags } from "~/renderer/stores";
import classes from "./FilterGroup.module.css";
import { FilterTextInput } from "./components/FilterTextInput";
import { Tags } from "./components";

export type FilterGroupProps = {
    tagCategory: keyof FilterTags;
};

export const FilterGroup = observer(({ tagCategory }: FilterGroupProps) => {
    const bookViewStore = useBookViewStore();
    const { getTags, setActiveTag, setTagsSearchTerm, getCategoryName } =
        bookViewStore.useTags(tagCategory);

    const [searchTermValue, setSearchTermValue] = useState("");
    const [debouncedSearchTerm] = useDebouncedValue(searchTermValue, 50, { leading: true });

    useEffect(() => setTagsSearchTerm(debouncedSearchTerm), [debouncedSearchTerm]);

    return (
        <Stack gap={rem(4)}>
            <Menu.Label p={0}>
                <FilterTextInput
                    variant="subtle"
                    size="xs"
                    px="xs"
                    onChange={(e) => setSearchTermValue(e.currentTarget.value)}
                    getValue={() => searchTermValue}
                    getPlaceholder={getCategoryName}
                    getRightSectionPointerEvents={() => (searchTermValue ? "auto" : "none")}
                    getRightSection={() =>
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
                <Tags getTags={getTags} onTagToggle={setActiveTag} />
            </ScrollArea>
        </Stack>
    );
});
