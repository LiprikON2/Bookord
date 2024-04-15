import React from "react";
import { Image, Burger, Group, Text, rem } from "@mantine/core";
import { IconClock, IconClockFilled } from "@tabler/icons-react";

import { useFilterTags, useTags } from "~/renderer/stores";
import { icons } from "~/renderer/components";
import { ToggleActionIcon } from "~/renderer/components";
import { WindowControls, SearchInput, FilterMenu } from "./components";
import classes from "./Titlebar.module.css";

export const Titlebar = ({
    showBurger,
    toggleBurger,
    showFilterMenu,
}: {
    showBurger: boolean;
    toggleBurger: () => void;
    showFilterMenu: boolean;
}) => {
    const { resetActiveTags } = useFilterTags();
    const { tagCategoryName, tags, resetTagCategory, setActiveTag } = useTags("recent");
    const recentFilterActive = tags.find((tag) => tag.name === "active")?.active ?? false;

    const handleRecentFilterOn = () => {
        resetActiveTags();
        setActiveTag("active", true);
    };
    const handleRecentFilterOff = () => {
        resetTagCategory();
    };

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
                    <Image mx={4} h={24} src={icons.bookordStandalone} hiddenFrom="sm" />
                    <Image mx={4} h={24} src={icons.bookordLogoStandalone} visibleFrom="sm" />
                    {/* <Image m={4} h={24} w={24} src={icons.bookord} />
                    <Text size="xl" c="unset">
                        Bookord
                    </Text> */}
                </Group>
            </Group>
            <Group className={classes.searchGroup} wrap="nowrap">
                <SearchInput />
                {showFilterMenu && (
                    <Group wrap="nowrap" gap={0}>
                        <FilterMenu />

                        <ToggleActionIcon
                            aria-label={tagCategoryName}
                            OnIcon={IconClockFilled}
                            OffIcon={IconClock}
                            onAction={handleRecentFilterOn}
                            offAction={handleRecentFilterOff}
                            on={recentFilterActive}
                            classNames={{ icon: classes.icon }}
                        />
                    </Group>
                )}
            </Group>
            <Group className={classes.windowControlsGroup}>
                <WindowControls platform="windows" tooltips={true} />
            </Group>
        </Group>
    );
};
