import React from "react";
import { useDisclosure } from "@mantine/hooks";
import {
    AppShell as MantineAppShell,
    Image,
    Burger,
    Group,
    Skeleton,
    ScrollArea,
    TextInput,
    Text,
    rem,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import { icons } from "~/components/Icons";
import WindowControls from "~/misc/window/components/WindowControls";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
    const [opened, { toggle }] = useDisclosure();

    return (
        <MantineAppShell
            header={{ height: 48 }}
            navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
            padding="md"
        >
            <MantineAppShell.Header>
                <Group h="100%" px="md" justify="space-between">
                    <Group p={0}>
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Group>
                            <Image m={4} h={24} w={24} src={icons.bookord} />
                            <Text size="xl">Bookord</Text>
                        </Group>
                    </Group>
                    <Group p={0} style={{ flexBasis: "40%" }}>
                        <TextInput
                            size="xs"
                            w="100%"
                            placeholder="Search for books"
                            rightSectionPointerEvents="none"
                            rightSection={
                                <IconSearch
                                    style={{ width: rem(16), height: rem(16) }}
                                    stroke={1.5}
                                />
                            }
                        />
                    </Group>
                    <Group p={0}>
                        <WindowControls platform="windows" tooltips={true} />
                    </Group>
                </Group>
            </MantineAppShell.Header>
            <MantineAppShell.Navbar p="md">
                <MantineAppShell.Section>Navbar header</MantineAppShell.Section>
                <MantineAppShell.Section grow my="md" component={ScrollArea}>
                    60 links in a scrollable section
                    {Array(10)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton key={index} h={28} mt="sm" animate={false} />
                        ))}
                </MantineAppShell.Section>
                <MantineAppShell.Section>
                    Navbar footer – always at the bottom
                </MantineAppShell.Section>
            </MantineAppShell.Navbar>
            <MantineAppShell.Main>{children}</MantineAppShell.Main>
        </MantineAppShell>
    );
};
