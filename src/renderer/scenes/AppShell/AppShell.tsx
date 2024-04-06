import React from "react";
import { useDisclosure } from "@mantine/hooks";
import {
    Box,
    BoxProps,
    AppShell as MantineAppShell,
    AppShellProps as MantineAppShellProps,
    Overlay,
    ScrollArea,
    rem,
} from "@mantine/core";

import { BookKey, type BookStateOpened } from "~/renderer/stores";
import { ThemeToggle } from "~/renderer/components";
import { SettingsModal, Sidebar, type SidebarMarkup, Titlebar } from "./scenes";
import classes from "./AppShell.module.css";

interface AppShellProps {
    layoutMarkup: LayoutMarkup;
    children?: React.ReactNode;
}

export type LayoutMarkup = {
    showFilterMenu: boolean;
    getAppShellProps: (openedNavbar: boolean, openedAside: boolean) => MantineAppShellProps;
    getNavbarMarkup: (openedBookRecords: BookStateOpened[]) => SidebarMarkup;
    getAsideMarkup: () => SidebarMarkup;
    scrollArea: boolean;
    mainBoxProps: BoxProps;
};

export const AppShell = ({ layoutMarkup, children }: AppShellProps) => {
    const [openedNavbar, { toggle: toggleNavbar, close: closeNavbar }] = useDisclosure();
    const [openedAside, { toggle: toggleAside, close: closeAside }] = useDisclosure();
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
            {...layoutMarkup.getAppShellProps(openedNavbar, openedAside)}
        >
            <MantineAppShell.Header>
                <Titlebar
                    showBurger={openedNavbar}
                    toggleBurger={toggleNavbar}
                    showFilterMenu={layoutMarkup.showFilterMenu}
                />
            </MantineAppShell.Header>
            <MantineAppShell.Navbar>
                <Sidebar getMarkup={layoutMarkup.getNavbarMarkup} onChangeTab={closeNavbar}>
                    <SettingsModal />
                    <ThemeToggle />
                </Sidebar>
            </MantineAppShell.Navbar>
            <MantineAppShell.Aside></MantineAppShell.Aside>
            <MantineAppShell.Main>
                {openedNavbar && <Overlay onClick={closeNavbar} backgroundOpacity={0.25} />}

                {/* TODO scroll area isn't showing anymore */}

                <Box className={classes.mainBox} {...layoutMarkup.mainBoxProps}>
                    {layoutMarkup.scrollArea ? (
                        <ScrollArea
                            h="100%"
                            type="auto"
                            styles={{
                                scrollbar: { margin: "-1px", marginTop: rem(8) },
                            }}
                        >
                            {children}
                        </ScrollArea>
                    ) : (
                        children
                    )}
                </Box>
            </MantineAppShell.Main>
        </MantineAppShell>
    );
};
