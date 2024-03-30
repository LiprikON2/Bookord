import React from "react";
import { ScrollArea, rem } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";

import { AppShell, LayoutMarkup } from "~/renderer/scenes";
import { IconBooks, IconHome, IconInfoCircle, IconLibrary } from "@tabler/icons-react";

const libraryLayoutMarkup: LayoutMarkup = {
    getAppShellProps: (openedNavbar: boolean, openedAside: boolean) => ({
        navbar: { width: 200, breakpoint: "sm", collapsed: { mobile: !openedNavbar } },
        aside: { width: 200, breakpoint: "sm", collapsed: { mobile: true, desktop: true } },
    }),

    getNavbarMarkup: () => [
        {
            name: "Home",
            Icon: IconHome,
            innerTabs: [
                {
                    tabHeading: "General",
                    tabs: [
                        { name: "Library", Icon: IconBooks, to: "/layout-library/library" },
                        { name: "About", Icon: IconInfoCircle, to: "/layout-library/about" },
                    ],
                },
                {
                    tabHeading: "Books",
                    tabs: [
                        {
                            name: "Book 1",
                            to: "/",
                            canBeClosed: true,
                        },
                    ],
                },
            ],
        },
        // {
        //     name: "Home2",
        //     Icon: IconHome,
        //     innerTabs: [],
        // },
    ],
    getAsideMarkup: () => [],
};

export const LayoutLibrary = () => {
    return (
        <AppShell layoutMarkup={libraryLayoutMarkup}>
            <Outlet />
        </AppShell>
    );
};
