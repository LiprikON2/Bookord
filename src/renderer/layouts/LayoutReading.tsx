import React from "react";
import { ScrollArea, rem } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";

import { AppShell, LayoutMarkup } from "~/renderer/scenes";
import { IconHome, IconInfoCircle, IconLibrary } from "@tabler/icons-react";

const readingLayoutMarkup: LayoutMarkup = {
    getAppShellProps: (openedNavbar: boolean, openedAside: boolean) => ({
        navbar: { width: 200, breakpoint: "sm", collapsed: { mobile: !openedNavbar } },
        aside: { width: 200, breakpoint: "sm", collapsed: { mobile: true, desktop: true } },
    }),

    navbarMarkup: [
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
        {
            name: "Home2",
            Icon: IconHome,
            innerTabs: [],
        },
    ],
    asideMarkup: [],
};

export const LayoutReading = () => {
    return (
        <AppShell layoutMarkup={readingLayoutMarkup}>
            <Outlet />
        </AppShell>
    );
};
