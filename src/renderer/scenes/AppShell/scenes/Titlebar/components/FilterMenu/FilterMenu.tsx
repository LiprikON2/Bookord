import React, { useState } from "react";
import { Button, Menu, rem } from "@mantine/core";
import { IconFilter, IconFilterFilled } from "@tabler/icons-react";

import { useBooks } from "~/renderer/hooks";
import { FilterGroup } from "./components";
import { ToggleActionIcon } from "~/components/ToggleActionIcon";
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
                        items={tags.subjects}
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
