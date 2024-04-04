import React, { useState } from "react";
import { Box, Button, CloseButton, Stack, Tabs, Text, rem } from "@mantine/core";
import { type ToOptions, useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { IconCirclePlus, type Icon, IconX } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import context from "~/renderer/ipc/fileOperations";
import { BookKey, BookStateOpened, bookStore } from "~/renderer/stores";
import { useHistory, useIsMobile } from "~/renderer/hooks";
import { Bottom, SegmentedTabList } from "./components";
import classes from "./Sidebar.module.css";
import { libraryRoute } from "~/renderer/appRenderer";

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
};

export type SidebarMarkup = {
    name: string;
    Icon: Icon;
    innerTabs: SidebarInnerTab[];
}[];

const desktopProps = { variant: "outline" };
const mobileProps = { variant: "pills" };

export const Sidebar = observer(
    ({
        getMarkup,
        onChangeTab,
        children,
    }: {
        getMarkup: (openedBookRecords: BookStateOpened[]) => SidebarMarkup;
        onChangeTab: () => void;
        children: React.ReactNode;
    }) => {
        const isMobile = useIsMobile();
        const navigate = useNavigate();
        const { currentPath, history } = useHistory();
        const params: Params = useParams({ strict: false });

        const markup = getMarkup(bookStore.getBookStateOpened());

        const openFileDialog = async () => {
            const distinctFileCount = await context.openFileDialog();
        };

        const closeBook = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, tab: SidebarTab) => {
            // e.preventDefault();
            e.stopPropagation();

            if ("bookKey" in tab.navParams?.params) {
                const tabBookKey = tab.navParams.params.bookKey;
                bookStore.closeBook(tabBookKey);

                const isTabCurrentlyOpen = params.bookKey === tabBookKey;
                if (isTabCurrentlyOpen) {
                    const isPreviousTabAvaliable = markup.some(({ innerTabs }) =>
                        innerTabs.some(({ tabs }) =>
                            tabs.some(
                                (tab) => tab.id === previousInnerTab && tab.id !== activeInnerTab
                            )
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
        const [activeInnerTab, setActiveInnerTab] = useState(currentPath);

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
                        tab: classes.outerTab,
                        panel: classes.outerPanel,
                    }}
                    orientation="horizontal"
                    defaultValue={markup[0]?.name}
                >
                    <Stack h={48} mr="sm" justify="center">
                        {markup.length > 1 ? (
                            <SegmentedTabList markup={markup} />
                        ) : (
                            <Button
                                onClick={openFileDialog}
                                leftSection={<IconCirclePlus className={classes.icon} />}
                                variant="outline"
                                mx="xs"
                            >
                                Add books
                            </Button>
                        )}
                    </Stack>

                    {markup.map((outerTab) => (
                        <Tabs.Panel key={outerTab.name} value={outerTab.name}>
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
                                        value={activeInnerTab}
                                        onChange={(value) => changeTab(value, innerTab)}
                                        {...(isMobile ? mobileProps : desktopProps)}
                                    >
                                        <Stack p={0} m={0} gap={0} h="100%">
                                            <Tabs.List>
                                                <Text className={classes.tabHeading} c="dimmed">
                                                    {innerTab.tabHeading}
                                                </Text>

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
                                                                    // variant="transparent"
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
    }
);
