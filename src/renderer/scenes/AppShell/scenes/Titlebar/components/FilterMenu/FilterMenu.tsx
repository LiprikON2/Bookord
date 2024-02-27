import React, { useState } from "react";
import { IconFilter, IconFilterFilled } from "@tabler/icons-react";

import { FilterGroup } from "./components";
import { ToggleActionIcon } from "~/components/ToggleActionIcon";
import { Button, Flex, Grid, Group, Menu, rem } from "@mantine/core";
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
            <Menu.Dropdown p={rem(8)} /* w="40vw" */ h="40vh">
                <div className={classes.filterGrid}>
                    {/* <Flex
                    gap={rem(4)}
                    maw="100%"
                    justify="flex-start"
                    align="flex-start"
                    direction="row"
                    wrap="wrap"
                > */}
                    {/* <Group wrap="nowrap" p="xs"> */}
                    {/* <Grid grow gutter={rem(4)} maw="100%"> */}
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
                    {/* </Grid> */}
                    {/* </Group> */}
                    {/* </Flex> */}
                </div>
            </Menu.Dropdown>
        </Menu>
    );
};
