import React from "react";
import { Outlet } from "@tanstack/react-router";
import { IconBookmarks, IconList, IconSpeakerphone, IconUsers } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import {
    Toc,
    AppShell,
    LayoutMarkup,
    TextToSpeech,
    Bookmarks,
    Comments,
    Characters,
} from "~/renderer/scenes";
import { getHomeMarkup } from "./sharedLayoutMarkup";
import { LayoutToggle } from "../components";

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
        {
            name: "Characters",
            Icon: IconUsers,
            innerTabs: [],
            Component: Characters,
        },
    ],
    asideTopSection: null,
    asideBottomSection: (
        <>
            <LayoutToggle />
            <Comments />
        </>
    ),

    scrollArea: false,
};

export const LayoutReading = observer(() => {
    return (
        <AppShell layoutMarkup={readingLayoutMarkup}>
            <Outlet />
        </AppShell>
    );
});
