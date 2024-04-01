import React from "react";
import { Box, Button, Stack, Tabs, Text, rem } from "@mantine/core";
import { type ToOptions, useNavigate, useParams } from "@tanstack/react-router";
import { IconCirclePlus, type Icon } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import context from "~/renderer/ipc/fileOperations";
import { BookStateOpened, bookStore } from "~/renderer/store";
import { useHistory, useIsMobile } from "~/renderer/hooks";
import { Bottom, SegmentedTabList } from "./components";
import classes from "./Sidebar.module.css";

export type NavParams = {
    to: ToOptions["to"];
    params?: ToOptions["params"];
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
        close,
        children,
    }: {
        getMarkup: (openedBookRecords: BookStateOpened) => SidebarMarkup;
        close: () => void;
        children: React.ReactNode;
    }) => {
        const isMobile = useIsMobile();
        const navigate = useNavigate();
        const { currentPath } = useHistory();
        const markup = getMarkup(bookStore.getBookStateOpened());

        const openFileDialog = async () => {
            const distinctFileCount = await context.openFileDialog();
        };

        const changeTab = (id: string, innerTab: SidebarInnerTab) => {
            const { navParams } = innerTab.tabs.find((tab) => tab.id === id);
            navigate(navParams);
            close();
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
                        {/* {markup.length > 1 && <SegmentedTabList markup={markup} />} */}
                        {/* <SegmentedTabList
                            markup={markup}
                            style={{ visibility: markup.length > 1 ? "visible" : "hidden" }}
                        /> */}
                        {/* <Tabs.List>
                            {markup.map((outerTab) => (
                                <Tabs.Tab
                                    key={outerTab.name}
                                    value={outerTab.name}
                                    leftSection={<outerTab.Icon className={classes.icon} />}
                                />
                            ))}
                            </Tabs.List> */}
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
                                        }}
                                        defaultValue={currentPath}
                                        keepMounted={true}
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
