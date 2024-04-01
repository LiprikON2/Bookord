import React from "react";
import { Outlet } from "@tanstack/react-router";
import { IconList } from "@tabler/icons-react";

import { AppShell, LayoutMarkup } from "~/renderer/scenes";
import { getHomeMarkup } from "./sharedLayoutMarkup";

const readingLayoutMarkup: LayoutMarkup = {
    getAppShellProps: (openedNavbar, openedAside) => ({
        navbar: { width: 200, breakpoint: "sm", collapsed: { mobile: !openedNavbar } },
        aside: { width: 200, breakpoint: "sm", collapsed: { mobile: true, desktop: true } },
    }),

    getNavbarMarkup: (openedBookRecords) => [
        getHomeMarkup(openedBookRecords),
        {
            name: "Table Of Contents",
            Icon: IconList,
            innerTabs: [],
        },
    ],
    getAsideMarkup: () => [],
};

export const LayoutReading = () => {
    return (
        <AppShell layoutMarkup={readingLayoutMarkup}>
            <Outlet />
        </AppShell>
    );
};
