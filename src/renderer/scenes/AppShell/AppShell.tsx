import React from "react";
import { useDisclosure } from "@mantine/hooks";
import {
    Box,
    AppShell as MantineAppShell,
    AppShellProps as MantineAppShellProps,
    Overlay,
    ScrollArea,
    rem,
} from "@mantine/core";
import { observer } from "mobx-react-lite";

import { type BookStateOpened } from "~/renderer/stores";
import { ThemeToggle } from "~/renderer/components";
import { useIsMobile } from "~/renderer/hooks";
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
    navbarTopSection: React.ReactNode;
    getAsideMarkup: () => SidebarMarkup;
    asideTopSection: React.ReactNode;
    asideBottomSection: React.ReactNode;
    scrollArea: boolean;
};

export const AppShell = observer(({ layoutMarkup, children }: AppShellProps) => {
    const [openedNavbar, { toggle: mobileToggleNavbar, close: mobileCloseNavbar }] =
        useDisclosure();
    const [openedAside, { toggle: mobileToggleAside, close: mobileCloseAside }] = useDisclosure();

    const isMobile = useIsMobile();
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
                    toggleBurger={mobileToggleNavbar}
                    showFilterMenu={layoutMarkup.showFilterMenu}
                />
            </MantineAppShell.Header>
            <MantineAppShell.Navbar>
                <Sidebar
                    position="left"
                    topSection={layoutMarkup.navbarTopSection}
                    getMarkup={layoutMarkup.getNavbarMarkup}
                    onChangeTab={mobileCloseNavbar}
                >
                    <SettingsModal classNames={{ button: classes.button }} />
                    <ThemeToggle />
                </Sidebar>
            </MantineAppShell.Navbar>
            <MantineAppShell.Aside>
                <Sidebar
                    position="right"
                    topSection={layoutMarkup.asideTopSection}
                    getMarkup={layoutMarkup.getAsideMarkup}
                    onChangeTab={mobileCloseAside}
                >
                    {layoutMarkup.asideBottomSection}
                </Sidebar>
            </MantineAppShell.Aside>
            <MantineAppShell.Main>
                {openedNavbar && isMobile && (
                    <Overlay onClick={mobileCloseNavbar} backgroundOpacity={0.25} />
                )}

                <Box className={classes.mainBox}>
                    {layoutMarkup.scrollArea ? (
                        <ScrollArea
                            h="100%"
                            type="auto"
                            scrollbarSize={8}
                            styles={{
                                scrollbar: { margin: "-1px", marginTop: rem(8) },
                                viewport: { paddingInline: "var(--mantine-spacing-md)" },
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
});
