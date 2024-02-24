import React from "react";
import { Image, Burger, Group, Text } from "@mantine/core";
import { IconClock, IconClockFilled } from "@tabler/icons-react";

import { WindowControls, SearchInput, FilterMenu } from "./components";
import { icons } from "~/components/Icons";
import classes from "./Titlebar.module.css";
import { ToggleActionIcon } from "~/components/ToggleActionIcon";

export const Titlebar = ({ opened, toggle }: { opened: boolean; toggle: () => void }) => {
    return (
        <Group
            className={classes.titlebarGroup}
            h="100%"
            pl="md"
            justify="space-between"
            wrap="nowrap"
        >
            <Group p={0}>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <Group>
                    <Image m={4} h={24} w={24} src={icons.bookord} />
                    <Text size="xl" c="unset">
                        Bookord
                    </Text>
                </Group>
            </Group>
            <Group className={classes.searchGroup} wrap="nowrap">
                <SearchInput />
                <Group wrap="nowrap" gap={0}>
                    <FilterMenu />
                    <ToggleActionIcon
                        aria-label="Recent"
                        OnIcon={IconClockFilled}
                        OffIcon={IconClock}
                        onAction={() => console.log("its on")}
                        offAction={() => console.log("its off")}
                        iconStyle={{ color: "var(--mantine-color-dark-0)" }}
                    />
                </Group>
            </Group>
            <Group className={classes.windowControlsGroup}>
                <WindowControls platform="windows" tooltips={true} />
            </Group>
        </Group>
    );
};
