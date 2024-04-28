import React, { useState } from "react";
import { Box, Button, CloseButton, ScrollArea, Stack, Tabs, Text } from "@mantine/core";
import { type ToOptions, useNavigate, useParams } from "@tanstack/react-router";
import { IconCirclePlus, type Icon } from "@tabler/icons-react";

import context from "~/renderer/ipc/fileOperations";
import { BookKey, BookStateOpened, bookStore, useOpenedBooks } from "~/renderer/stores";
import { useHistory, useIsMobile } from "~/renderer/hooks";
import { Bottom, PanelContent, SegmentedTabList } from "./components";
import classes from "./Sidebar.module.css";

type Params = ToOptions["params"] & { bookKey?: BookKey };
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

const desktopProps = { variant: "outline" };
const mobileProps = { variant: "pills" };

// TODO use another router (<Outlet/>) to render Sidebar tabs' content
export const Sidebar = ({
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
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { currentPath } = useHistory();
    const params: Params = useParams({ strict: false });

    const openedBooks = useOpenedBooks();

    const markup = getMarkup(openedBooks);

    const closeBook = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, tab: SidebarTab) => {
        e.stopPropagation();

        if ("bookKey" in tab.navParams?.params) {
            const tabBookKey = tab.navParams.params.bookKey;
            bookStore.closeBook(tabBookKey);

            const isTabCurrentlyOpen = params.bookKey === tabBookKey;
            if (isTabCurrentlyOpen) {
                const isPreviousTabAvaliable = markup.some(({ innerTabs }) =>
                    innerTabs.some(({ tabs }) =>
                        tabs.some((tab) => tab.id === previousInnerTab && tab.id !== activeInnerTab)
                    )
                );

                const homeTab = markup[0].innerTabs[0].tabs[0].id;
                const nextTo = isPreviousTabAvaliable ? previousInnerTab : homeTab;

                navigate({ to: nextTo });
                setActiveInnerTab(nextTo);
            }
        }
    };

    const [previousInnerTab, setPreviousInnerTab] = useState<string | null>(null);
    const [activeInnerTab, setActiveInnerTab] = useState(decodeURIComponent(currentPath));

    const changeTab = (id: string, innerTab: SidebarInnerTab) => {
        if (id === activeInnerTab) return;

        const { navParams } = innerTab.tabs.find((tab) => tab.id === id);
        navigate(navParams);
        setPreviousInnerTab(activeInnerTab);
        setActiveInnerTab(id);

        onChangeTab();
    };

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
                        {outerTab.innerTabs
                            .filter((innerTab) => innerTab.tabs.length)
                            .map((innerTab) => (
                                <Tabs
                                    key={innerTab.tabHeading}
                                    classNames={{
                                        root: classes.root,
                                        list: classes.list,
                                        tab: classes.tab,
                                        tabLabel: classes.tabLabel,
                                        tabSection: classes.tabSection,
                                    }}
                                    styles={{
                                        root: {
                                            ...(innerTab.dynamicHeight && {
                                                minHeight: 0,
                                            }),
                                        },
                                    }}
                                    value={activeInnerTab}
                                    onChange={(value) => changeTab(value, innerTab)}
                                    {...(isMobile ? mobileProps : desktopProps)}
                                >
                                    <Stack p={0} m={0} gap={0} h="100%">
                                        <Text className={classes.tabHeading} c="dimmed">
                                            {innerTab.tabHeading}
                                        </Text>
                                        <Tabs.List>
                                            <ScrollArea
                                                w="100%"
                                                scrollbars="y"
                                                scrollbarSize={6}
                                                type="hover"
                                                classNames={{
                                                    viewport: classes.viewport,
                                                    scrollbar: classes.scrollbar,
                                                }}
                                            >
                                                {innerTab.tabs.map((tab) => (
                                                    <Tabs.Tab
                                                        component="div"
                                                        key={tab.id}
                                                        value={tab.id}
                                                        role="link"
                                                        leftSection={
                                                            tab.Icon && (
                                                                <tab.Icon
                                                                    className={classes.icon}
                                                                />
                                                            )
                                                        }
                                                        rightSection={
                                                            tab.canBeClosed && (
                                                                <CloseButton
                                                                    size="sm"
                                                                    onClick={(e) =>
                                                                        closeBook(e, tab)
                                                                    }
                                                                />
                                                            )
                                                        }
                                                    >
                                                        {tab.name}
                                                    </Tabs.Tab>
                                                ))}
                                            </ScrollArea>
                                        </Tabs.List>
                                    </Stack>
                                </Tabs>
                            ))}
                    </Tabs.Panel>
                ))}
            </Tabs>
            <Bottom>{children}</Bottom>
        </>
    );
};
