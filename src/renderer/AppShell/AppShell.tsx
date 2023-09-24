import React, { useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { AppShell as MantineAppShell } from "@mantine/core";

import { Sidebar, Titlebar } from "./components";
import classes from "./AppShell.module.css";
import { useColorScheme } from "~/renderer/hooks";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
    const [opened, { toggle }] = useDisclosure();
    const { dark } = useColorScheme();

    // TODO move into separate hook
    /**
     * On Dark theme change
     */
    useEffect(() => {
        if (dark) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [dark]);

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
