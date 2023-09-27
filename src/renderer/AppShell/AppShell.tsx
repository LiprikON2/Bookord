import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { AppShell as MantineAppShell } from "@mantine/core";

import { ThemeToggle } from "~/renderer/components";
import { SettingsModal, Sidebar, Titlebar } from "./components";
import classes from "./AppShell.module.css";
import { IconMessageCircle, IconPhoto } from "@tabler/icons-react";
import { libraryRoute, testRoute } from "~/renderer/appRenderer";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
    const [opened, { toggle }] = useDisclosure();
    const links = [
        { to: libraryRoute.to, name: "Library", Icon: IconPhoto },
        { to: testRoute.to, name: "Messages", Icon: IconMessageCircle },
    ];

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
                <Sidebar links={links}>
                    <Sidebar.Bottom>
                        <SettingsModal />
                        <ThemeToggle />
                    </Sidebar.Bottom>
                </Sidebar>
            </MantineAppShell.Navbar>
            <MantineAppShell.Main>{children}</MantineAppShell.Main>
        </MantineAppShell>
    );
};
