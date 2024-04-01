import React from "react";
import { Outlet } from "@tanstack/react-router";

import { AppShell, LayoutMarkup } from "~/renderer/scenes";
import { getHomeMarkup } from "./sharedLayoutMarkup";

const libraryLayoutMarkup: LayoutMarkup = {
    getAppShellProps: (openedNavbar, openedAside) => ({
        navbar: { width: 200, breakpoint: "sm", collapsed: { mobile: !openedNavbar } },
        aside: { width: 200, breakpoint: "sm", collapsed: { mobile: true, desktop: true } },
    }),

    getNavbarMarkup: (openedBookRecords) => [getHomeMarkup(openedBookRecords)],
    getAsideMarkup: () => [],
};

export const LayoutLibrary = () => {
    return (
        <AppShell layoutMarkup={libraryLayoutMarkup}>
            <Outlet />
        </AppShell>
    );
};
