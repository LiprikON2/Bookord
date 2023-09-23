import React from "react";
import { Image, Burger, Group, TextInput, Text, rem, Code, Pill } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";

import WindowControls from "~/misc/window/components/WindowControls";
import { icons } from "~/components/Icons";
import classes from "./Titlebar.module.css";

export const Titlebar = ({ opened, toggle }: { opened: boolean; toggle: () => void }) => {
    return (
        <Group className={classes.titlebarGroup} h="100%" pl="md" justify="space-between">
            <Group p={0}>
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <Group>
                    <Image m={4} h={24} w={24} src={icons.bookord} />
                    <Text size="xl">Bookord</Text>
                </Group>
            </Group>
            <Group className={classes.searchGroup}>
                <TextInput
                    size="xs"
                    w="100%"
                    placeholder="Search for books"
                    leftSectionPointerEvents="none"
                    leftSection={
                        <IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    }
                    rightSection={
                        <Pill
                            style={{
                                borderRadius: "var(--mantine-radius-default)",
                            }}
                        >
                            Ctrl + K
                        </Pill>
                    }
                    styles={{
                        section: {
                            width: "fit-content",
                            padding: rem(4),
                        },
                    }}
                />
            </Group>
            <Group className={classes.windowControlsGroup}>
                <WindowControls platform="windows" tooltips={true} />
            </Group>
        </Group>
    );
};
