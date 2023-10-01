import React from "react";
import { Image, Burger, Group, TextInput, Text, rem, Pill } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import { WindowControls, SearchInput } from "./components";
import { icons } from "~/components/Icons";
import classes from "./Titlebar.module.css";

export const Titlebar = ({ opened, toggle }: { opened: boolean; toggle: () => void }) => {
    return (
        <Group className={classes.titlebarGroup} h="100%" pl="md" justify="space-between">
            <Group p={0}>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <Group>
                    <Image m={4} h={24} w={24} src={icons.bookord} />
                    <Text size="xl" c="unset">
                        Bookord
                    </Text>
                </Group>
            </Group>
            <Group className={classes.searchGroup}>
                <SearchInput />
            </Group>
            <Group className={classes.windowControlsGroup}>
                <WindowControls platform="windows" tooltips={true} />
            </Group>
        </Group>
    );
};
