import { IconBooks, IconHome, IconInfoCircle } from "@tabler/icons-react";

import { BookStateOpened } from "../stores";
import { SidebarMarkup } from "../scenes/AppShell/scenes";
import { bookKeyRoute } from "../appRenderer";

export const getHomeMarkup = (
    openedBookRecords: BookStateOpened[]
): ArrayElement<SidebarMarkup> => ({
    name: "Home",
    Icon: IconHome,
    innerTabs: [
        {
            tabHeading: "General",
            tabs: [
                {
                    name: "Library",
                    Icon: IconBooks,
                    id: "/layout-library/library",
                    navParams: { to: "/layout-library/library" },
                },
                {
                    id: "/layout-library/about",
                    name: "About",
                    Icon: IconInfoCircle,
                    navParams: { to: "/layout-library/about" },
                },
            ],
            dynamicHeight: false,
        },
        {
            tabHeading: "Open",
            tabs: openedBookRecords.map((openedBook) => ({
                id: `/layout-reading/reading/${openedBook.bookKey}`,
                name: openedBook.title,
                canBeClosed: true,
                navParams: {
                    to: bookKeyRoute.to,
                    params: {
                        bookKey: openedBook.bookKey,
                    },
                },
            })),
            dynamicHeight: true,
        },
    ],
});
