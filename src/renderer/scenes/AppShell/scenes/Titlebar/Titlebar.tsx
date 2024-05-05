import React from "react";
import { Image, Burger, Group } from "@mantine/core";
import { IconClock, IconClockFilled } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { useBookViewStore } from "~/renderer/stores";
import { icons, ToggleActionIcon } from "~/renderer/components";
import { WindowControls, SearchInput, FilterMenu } from "./components";
import classes from "./Titlebar.module.css";

interface TitlebarProps {
    showBurger: boolean;
    toggleBurger: () => void;
    showFilterMenu: boolean;
}

export const Titlebar = observer(({ showBurger, toggleBurger, showFilterMenu }: TitlebarProps) => {
    const bookViewStore = useBookViewStore();

    const {
        getTags: getRecentTags,
        getCategoryName: getRecentName,
        resetActiveTags: resetRecentTags,
        setActiveTag: setRecentTag,
    } = bookViewStore.useTags("recent");

    const recentFilterActive =
        getRecentTags().find((tag) => tag.name === "active")?.active ?? false;

    const handleRecentFilterOn = () => {
        bookViewStore.resetTags();
        setRecentTag("active", true);
    };
    const handleRecentFilterOff = () => {
        resetRecentTags();
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
                </Group>
            </Group>
            <Group className={classes.searchGroup} wrap="nowrap">
                <SearchInput />
                {showFilterMenu && (
                    <Group wrap="nowrap" gap={0}>
                        <FilterMenu />

                        <ToggleActionIcon
                            classNames={{ icon: classes.icon }}
                            getAriaLabel={getRecentName}
                            OnIcon={IconClockFilled}
                            OffIcon={IconClock}
                            onAction={handleRecentFilterOn}
                            offAction={handleRecentFilterOff}
                            on={recentFilterActive}
                        />
                    </Group>
                )}
            </Group>
            <Group className={classes.windowControlsGroup}>
                <WindowControls platform="windows" tooltips={true} />
            </Group>
        </Group>
    );
});
