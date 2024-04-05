import React, { useEffect, useState } from "react";
import { Button, Menu, rem } from "@mantine/core";
import { IconFilter, IconFilterFilled } from "@tabler/icons-react";

import { FilterGroup } from "./components";
import { ToggleActionIcon } from "~/components/ToggleActionIcon";
import classes from "./FilterMenu.modules.css";
import { useFilterTags, useTags } from "~/renderer/stores";

export const FilterMenu = () => {
    const { resetActiveTags, categoriesHaveActiveTag } = useFilterTags();
    const { resetTagCategory } = useTags("recent");

    const [opened, setOpened] = useState(false);

    const handleMenuToggle = (opened: boolean) => {
        setOpened(opened);
        if (opened) resetTagCategory();
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
                    on={opened || categoriesHaveActiveTag}
                    classNames={{ icon: classes.icon }}
                />
            </Menu.Target>
            <Menu.Dropdown p={rem(8)} h="40vh">
                <div className={classes.filterGrid}>
                    <FilterGroup tagCategory="subjects" />
                    <FilterGroup tagCategory="publishYears" />
                    <FilterGroup tagCategory="languages" />
                    <Button
                        variant="default-alt-2"
                        value="settings"
                        fw="normal"
                        mt="auto"
                        style={{ alignSelf: "flex-end" }}
                        onClick={resetActiveTags}
                    >
                        Reset Filters
                    </Button>
                </div>
            </Menu.Dropdown>
        </Menu>
    );
};
