import React from "react";
import { useDisclosure } from "@mantine/hooks";
import {
    AppShell as MantineAppShell,
    AppShellProps as MantineAppShellProps,
    Overlay,
} from "@mantine/core";
import { IconHome, IconInfoCircle, IconLibrary } from "@tabler/icons-react";

import { ThemeToggle } from "~/renderer/components";
import { SettingsModal, Sidebar, type SidebarMarkup, Titlebar } from "./scenes";
import classes from "./AppShell.module.css";

interface AppShellProps {
    variant?: "library" | "reading";
    children?: React.ReactNode;
}

type VariantsConfig = {
    [key in AppShellProps["variant"]]: {
        MantineAppShellProps: MantineAppShellProps;
    };
};

const sidebarMarkup: SidebarMarkup = [
    {
        name: "Home",
        Icon: IconHome,
        innerTabs: [
            {
                tabHeading: "General",
                tabs: [
                    { name: "Library", Icon: IconLibrary, to: "/layout-library/library" },
                    { name: "About", Icon: IconInfoCircle, to: "/layout-library/about" },
                ],
            },
        ],
    },
];

export const AppShell = ({ variant = "library", children }: AppShellProps) => {
    const [opened, { toggle, close }] = useDisclosure();

    const variantsConfig: VariantsConfig = {
        library: {
            MantineAppShellProps: {
                navbar: { width: 200, breakpoint: "sm", collapsed: { mobile: !opened } },
                aside: { width: 200, breakpoint: "sm", collapsed: { mobile: true } },
            },
        },
        reading: {
            MantineAppShellProps: {
                navbar: { width: 200, breakpoint: "sm", collapsed: { mobile: !opened } },
                aside: { width: 200, breakpoint: "sm", collapsed: { mobile: true } },
            },
        },
    };

    return (
        <MantineAppShell
            classNames={{
                root: classes.root,
                main: classes.main,
                header: classes.header,
                navbar: classes.navbar,
                aside: classes.aside,
            }}
            padding="md"
            header={{ height: 48 }}
            {...variantsConfig[variant].MantineAppShellProps}
        >
            <MantineAppShell.Header>
                <Titlebar showBurger={opened} toggleBurger={toggle} />
            </MantineAppShell.Header>
            <MantineAppShell.Navbar>
                <Sidebar sidebarMarkup={sidebarMarkup} close={close}></Sidebar>
                <Sidebar.Bottom>
                    <SettingsModal />
                    <ThemeToggle />
                </Sidebar.Bottom>
            </MantineAppShell.Navbar>
            <MantineAppShell.Aside>Aside</MantineAppShell.Aside>
            <MantineAppShell.Main>
                {opened && <Overlay onClick={close} backgroundOpacity={0.25} />}

                {children}
            </MantineAppShell.Main>
        </MantineAppShell>
    );
};
