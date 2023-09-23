import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { AppShell as MantineAppShell, Skeleton, ScrollArea } from "@mantine/core";

import { Sidebar, Titlebar } from "./components";
import classes from "./AppShell.module.css";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
    const [opened, { toggle }] = useDisclosure();

    return (
        <MantineAppShell
            header={{ height: 48 }}
            navbar={{ width: 200, breakpoint: "sm", collapsed: { mobile: !opened } }}
            padding="md"
            classNames={{ main: classes.main, navbar: classes.navbar, header: classes.header }}
        >
            <MantineAppShell.Header>
                <Titlebar opened={opened} toggle={toggle} />
            </MantineAppShell.Header>
            <MantineAppShell.Navbar>
                {/* <MantineAppShell.Section>Navbar header</MantineAppShell.Section>
                <MantineAppShell.Section grow my="md" component={ScrollArea}>
                    {Array(5)
                        .fill(0)
                        .map((_, index) => (
                            <Skeleton key={index} h={28} mt="sm" animate={false} />
                        ))}
                </MantineAppShell.Section>
                <MantineAppShell.Section>Bottom</MantineAppShell.Section> */}

                <Sidebar />
            </MantineAppShell.Navbar>
            <MantineAppShell.Main>{children}</MantineAppShell.Main>
        </MantineAppShell>
    );
};
