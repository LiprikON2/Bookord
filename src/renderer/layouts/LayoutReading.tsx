import React from "react";
import { Outlet } from "@tanstack/react-router";
import { IconList } from "@tabler/icons-react";

import { AppShell, LayoutMarkup } from "~/renderer/scenes";
import { getHomeMarkup } from "./sharedLayoutMarkup";
import { Toc } from "../scenes/Reading/components/Toc";
import { bookKeyRoute } from "../appRenderer";
import { BookComponentContextProvider } from "../contexts";

export const LayoutReading = () => {
    const { bookKey } = bookKeyRoute.useParams();

    const readingLayoutMarkup: LayoutMarkup = {
        showFilterMenu: false,
        getAppShellProps: (openedNavbar, openedAside) => ({
            navbar: { width: 200, breakpoint: "sm", collapsed: { mobile: !openedNavbar } },
            aside: { width: 200, breakpoint: "sm", collapsed: { mobile: true, desktop: false } },
        }),

        getNavbarMarkup: (openedBookRecords) => [
            getHomeMarkup(openedBookRecords),
            {
                name: "Table Of Contents",
                Icon: IconList,
                innerTabs: [],
                Component: Toc,
                componentProps: {
                    bookKey,
                },
            },
        ],
        getAsideMarkup: () => [
            {
                name: "Table Of Contents",
                Icon: IconList,
                innerTabs: [],
            },
        ],
        scrollArea: false,
        mainBoxProps: { px: "md", py: 0 },
    };

    return (
        <BookComponentContextProvider>
            <AppShell layoutMarkup={readingLayoutMarkup}>
                <Outlet />
            </AppShell>
        </BookComponentContextProvider>
    );
};
