import React from "react";
import { useDisclosure } from "@mantine/hooks";
import { AppShell as MantineAppShell, Overlay } from "@mantine/core";
import { IconMessageCircle, IconPhoto } from "@tabler/icons-react";

import { ThemeToggle } from "~/renderer/components";
import { SettingsModal, Sidebar, Titlebar } from "./scenes";
import { libraryRoute, testRoute } from "~/renderer/appRenderer";
import classes from "./AppShell.module.css";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
    const [opened, { toggle, close }] = useDisclosure();
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
                <Sidebar links={links} close={close}>
                    <Sidebar.Bottom>
                        <SettingsModal />
                        <ThemeToggle />
                    </Sidebar.Bottom>
                </Sidebar>
            </MantineAppShell.Navbar>
            <MantineAppShell.Main>
                {opened && <Overlay onClick={close} backgroundOpacity={0.25} />}
                {children}
            </MantineAppShell.Main>
        </MantineAppShell>
    );
};
