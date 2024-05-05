import React from "react";
import { Outlet } from "@tanstack/react-router";

import { AddBooksButton, AppShell, LayoutMarkup } from "~/renderer/scenes";
import { getHomeMarkup } from "./sharedLayoutMarkup";
import { observer } from "mobx-react-lite";

const libraryLayoutMarkup: LayoutMarkup = {
    showFilterMenu: true,
    getAppShellProps: (openedNavbar, openedAside) => ({
        navbar: { width: 200, breakpoint: "sm", collapsed: { mobile: !openedNavbar } },
        aside: { width: 200, breakpoint: "sm", collapsed: { mobile: true, desktop: true } },
    }),

    getNavbarMarkup: (openedBookRecords) => [getHomeMarkup(openedBookRecords)],
    navbarTopSection: <AddBooksButton />,
    getAsideMarkup: () => [],
    asideTopSection: null,
    scrollArea: true,
};

export const LayoutLibrary = observer(() => {
    return (
        <AppShell layoutMarkup={libraryLayoutMarkup}>
            <Outlet />
        </AppShell>
    );
});
