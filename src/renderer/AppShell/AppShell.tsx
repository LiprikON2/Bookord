import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { AppShell as MantineAppShell } from "@mantine/core";

import { Sidebar, Titlebar } from "./components";
import classes from "./AppShell.module.css";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
    const [opened, { toggle }] = useDisclosure();

    return (
        <MantineAppShell
            header={{ height: 48 }}
            navbar={{ width: 200, breakpoint: "sm", collapsed: { mobile: !opened } }}
            padding="md"
            classNames={{
                root: classes.root,
                main: classes.main,
                navbar: classes.navbar,
                header: classes.header,
            }}
        >
            <MantineAppShell.Header>
                <Titlebar opened={opened} toggle={toggle} />
            </MantineAppShell.Header>
            <MantineAppShell.Navbar>
                <Sidebar />
            </MantineAppShell.Navbar>
            <MantineAppShell.Main>{children}</MantineAppShell.Main>
        </MantineAppShell>
    );
};
