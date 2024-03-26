import React, { useState } from "react";
import { IconFilter, IconFilterFilled } from "@tabler/icons-react";

import { FilterGroup } from "./components";
import { ToggleActionIcon } from "~/components/ToggleActionIcon";
import { Button, Menu, rem } from "@mantine/core";
import { useBooks } from "~/renderer/hooks";
import classes from "./FilterMenu.modules.css";

export const FilterMenu = () => {
    const { tags, setFilterTag, resetFilterTags, activeFilterTags, areMainFiltersActive } =
        useBooks();
    const [opened, setOpened] = useState(false);

    const handleMenuToggle = (opened: boolean) => {
        setOpened(opened);
        if (opened) setFilterTag("Custom", "Recent", false);
    };

    return (
        <Menu
            opened={opened}
            trigger="click"
            closeOnItemClick={false}
            onChange={handleMenuToggle}
            withArrow
            classNames={{ dropdown: classes.dropdown, itemLabel: classes.itemLabel }}
        >
            <Menu.Target>
                <ToggleActionIcon
                    aria-label="Filter"
                    OnIcon={IconFilterFilled}
                    OffIcon={IconFilter}
                    on={opened || areMainFiltersActive}
                    classNames={{ icon: classes.icon }}
                />
            </Menu.Target>
            <Menu.Dropdown p={rem(8)} h="40vh">
                <div className={classes.filterGrid}>
                    <FilterGroup
                        className={classes.filterGroup}
                        label="Genres"
                        items={{
                            ...tags.subjects,
                            // test: 99,
                            // no: 2,
                            // ds: 2,
                            // fsd: 12,
                            // "this is quite a long string": 12,

                            // svdfasd: 12,

                            // sfsad: 12,
                            // dsasd: 23,
                            // fdsafsd: 23,
                            // asdfasdf: 2,
                        }}
                        itemsState={activeFilterTags.Genres}
                        setItem={setFilterTag}
                    />
                    <FilterGroup
                        className={classes.filterGroup}
                        label="Year"
                        items={tags.year}
                        itemsState={activeFilterTags.Year}
                        setItem={setFilterTag}
                    />
                    <FilterGroup
                        className={classes.filterGroup}
                        label="Year"
                        items={tags.year}
                        itemsState={activeFilterTags.Year}
                        setItem={setFilterTag}
                    />
                    <FilterGroup
                        className={classes.filterGroup}
                        label="Year"
                        items={tags.year}
                        itemsState={activeFilterTags.Year}
                        setItem={setFilterTag}
                    />
                    <FilterGroup
                        className={classes.filterGroup}
                        label="Year"
                        items={tags.year}
                        itemsState={activeFilterTags.Year}
                        setItem={setFilterTag}
                    />
                    <Button
                        variant="default-alt-2"
                        value="settings"
                        fw="normal"
                        mt="auto"
                        style={{ alignSelf: "flex-end" }}
                        onClick={resetFilterTags}
                    >
                        Reset Filters
                    </Button>
                </div>
            </Menu.Dropdown>
        </Menu>
    );
};
