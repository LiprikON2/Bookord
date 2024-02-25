import React, { useState } from "react";
import { IconFilter, IconFilterFilled } from "@tabler/icons-react";

import { FilterGroup } from "./components";
import { ToggleActionIcon } from "~/components/ToggleActionIcon";
import { Flex, Menu } from "@mantine/core";
import { useBooks } from "~/renderer/hooks";
import classes from "./FilterMenu.modules.css";

export const FilterMenu = () => {
    const { tags, setTag } = useBooks();
    const [opened, setOpened] = useState(false);

    // TODO
    const filtersActive = false;

    return (
        <Menu
            opened={opened}
            trigger="click"
            closeOnItemClick={false}
            onChange={setOpened}
            withArrow
            styles={{
                dropdown: { backgroundColor: "var(--mantine-color-dark-7)" },
                itemLabel: { maxWidth: "100%" },
            }}
        >
            <Menu.Target>
                <ToggleActionIcon
                    aria-label="Filter"
                    OnIcon={IconFilterFilled}
                    OffIcon={IconFilter}
                    on={opened || filtersActive}
                    iconStyle={{ color: "var(--mantine-color-dark-0)" }}
                />
            </Menu.Target>
            <Menu.Dropdown
            // mah={`max(${rem(192)}, 1vh)`} maw={`max(${rem(384)}, 50vw)`}
            >
                <Flex
                    p="xs"
                    h="100%"
                    w="100%"
                    // bg="rgba(0, 0, 0, .3)"
                    gap="0"
                    justify="flex-start"
                    align="flex-start"
                    direction="row"
                    wrap="wrap"
                >
                    <FilterGroup
                        className={classes.filterGroup}
                        label="Genres"
                        items={tags.subjects}
                        setItem={setTag}
                    />
                    <FilterGroup
                        className={classes.filterGroup}
                        label="Year"
                        items={tags.year}
                        setItem={setTag}
                    />
                </Flex>
            </Menu.Dropdown>
        </Menu>
    );
};
