import React from "react";
import { Stack, Tabs } from "@mantine/core";
import { type ToOptions } from "@tanstack/react-router";
import { type Icon } from "@tabler/icons-react";

import { BookKey, BookStateOpened, useOpenedBooks } from "~/renderer/stores";
import { Bottom, PanelContent, PanelTabsContent, SegmentedTabList } from "./components";
import classes from "./Sidebar.module.css";
import { observer } from "mobx-react-lite";

export type Params = ToOptions["params"] & { bookKey?: BookKey };
export type NavParams = {
    to: ToOptions["to"];
    params?: Params;
};

export type SidebarTab = {
    /** Must match the `useHistory`'s `currentPath` for default value to work */
    id: string;
    name: string;
    navParams: NavParams;
    Icon?: Icon;
    canBeClosed?: boolean;
};
export type SidebarInnerTab = {
    tabHeading: string;
    tabs: SidebarTab[];
    dynamicHeight: boolean;
};

export type SidebarMarkup = {
    name: string;
    Icon: Icon;
    innerTabs: SidebarInnerTab[];
    Component?: (...args: any[]) => React.ReactNode;
    componentProps?: object;
}[];

// TODO consider using another router (<Outlet/>) to render Sidebar tabs' content
export const Sidebar = observer(
    ({
        getMarkup,
        topSection,
        onChangeTab,
        children,
    }: {
        getMarkup: (openedBookRecords: BookStateOpened[]) => SidebarMarkup;
        topSection?: React.ReactNode;
        onChangeTab: () => void;
        children?: React.ReactNode;
    }) => {
        const openedBooks = useOpenedBooks();
        const markup = getMarkup(openedBooks);

        return (
            <>
                <Tabs
                    variant="pills"
                    classNames={{
                        root: classes.outerRoot,
                        tab: classes.outerTab,
                        panel: classes.outerPanel,
                    }}
                    orientation="horizontal"
                    defaultValue={markup[0]?.name}
                >
                    {(topSection || markup.length > 1) && (
                        <Stack h={48} mr="sm" justify="center">
                            {topSection}
                            {markup.length > 1 && <SegmentedTabList markup={markup} />}
                        </Stack>
                    )}

                    {markup.map((outerTab) => (
                        <Tabs.Panel key={outerTab.name} value={outerTab.name}>
                            {outerTab.Component && (
                                <PanelContent heading={outerTab.name}>
                                    {(autoscrollTargetRef) => (
                                        <outerTab.Component
                                            autoscrollTargetRef={autoscrollTargetRef}
                                            {...outerTab.componentProps}
                                        />
                                    )}
                                </PanelContent>
                            )}
                            <PanelTabsContent
                                markup={markup}
                                outerTab={outerTab}
                                onChangeTab={onChangeTab}
                            />
                        </Tabs.Panel>
                    ))}
                </Tabs>
                <Bottom>{children}</Bottom>
            </>
        );
    }
);
