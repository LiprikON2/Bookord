import React from "react";
import { Image, Burger, Group, Text, rem } from "@mantine/core";
import { IconClock, IconClockFilled } from "@tabler/icons-react";

import { WindowControls, SearchInput, FilterMenu } from "./components";
import { icons } from "~/components/Icons";
import classes from "./Titlebar.module.css";
import { ToggleActionIcon } from "~/components/ToggleActionIcon";
import { useBooks } from "~/renderer/hooks";

export const Titlebar = ({
    showBurger,
    toggleBurger,
}: {
    showBurger: boolean;
    toggleBurger: () => void;
}) => {
    // const { setFilterTag, activeFilterTags } = useBooks();

    // const handleRecentFilterOn = () => {
    //     setFilterTag("Custom", "Recent", true);
    // };
    // const handleRecentFilterOff = () => {
    //     setFilterTag("Custom", "Recent", false);
    // };

    return (
        <Group
            className={classes.titlebarGroup}
            h="100%"
            pl="md"
            justify="space-between"
            wrap="nowrap"
        >
            <Group p={0} wrap="nowrap">
                <Burger opened={showBurger} onClick={toggleBurger} hiddenFrom="sm" size="sm" />
                <Group wrap="nowrap">
                    <Image m={4} h={24} w={24} src={icons.bookord} />
                    <Text size="xl" c="unset">
                        Bookord
                    </Text>
                </Group>
            </Group>
            <Group className={classes.searchGroup} wrap="nowrap">
                <SearchInput />
                <Group wrap="nowrap" gap={0}>
                    {/* <FilterMenu />
                    <ToggleActionIcon
                        aria-label="Recent"
                        OnIcon={IconClockFilled}
                        OffIcon={IconClock}
                        onAction={handleRecentFilterOn}
                        offAction={handleRecentFilterOff}
                        on={activeFilterTags.Custom?.Recent ?? false}
                        classNames={{ icon: classes.icon }}
                    /> */}
                </Group>
            </Group>
            <Group className={classes.windowControlsGroup}>
                <WindowControls platform="windows" tooltips={true} />
            </Group>
        </Group>
    );
};
