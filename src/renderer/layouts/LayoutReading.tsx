import React from "react";
import { Outlet } from "@tanstack/react-router";
import { IconBookmarks, IconList, IconSpeakerphone } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { Toc, AppShell, LayoutMarkup, TextToSpeech, Bookmarks, Comments } from "~/renderer/scenes";
import { getHomeMarkup } from "./sharedLayoutMarkup";

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
        },
        {
            name: "Bookmarks",
            Icon: IconBookmarks,
            innerTabs: [],
            Component: Bookmarks,
        },
    ],
    navbarTopSection: null,

    getAsideMarkup: () => [
        {
            name: "Text-to-Speech",
            Icon: IconSpeakerphone,
            innerTabs: [],
            Component: TextToSpeech,
        },
        // {
        //     name: "Comments",
        //     Icon: IconMessages,
        //     innerTabs: [],
        //     Component: Comments,
        // },
    ],
    asideTopSection: null,
    asideBottomSection: <Comments />,

    scrollArea: false,
};

export const LayoutReading = observer(() => {
    return (
        <AppShell layoutMarkup={readingLayoutMarkup}>
            <Outlet />
        </AppShell>
    );
});
