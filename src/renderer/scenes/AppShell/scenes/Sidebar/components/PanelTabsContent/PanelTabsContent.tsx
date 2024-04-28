import React, { useState } from "react";
import { CloseButton, ScrollArea, Stack, Tabs, Text } from "@mantine/core";
import { useNavigate, useParams } from "@tanstack/react-router";

import { bookStore } from "~/renderer/stores";
import { useHistory, useIsMobile } from "~/renderer/hooks";
import { Params, SidebarInnerTab, SidebarMarkup, SidebarTab } from "../../Sidebar";

import classes from "./PanelTabsContent.module.css";

interface PanelTabsContentProps {
    markup: SidebarMarkup;
    outerTab: ArrayElement<SidebarMarkup>;
    onChangeTab: () => void;
}

const desktopProps = { variant: "outline" };
const mobileProps = { variant: "pills" };

export const PanelTabsContent = ({ markup, outerTab, onChangeTab }: PanelTabsContentProps) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { currentPath } = useHistory();
    const params: Params = useParams({ strict: false });

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

    return outerTab.innerTabs
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
                                    leftSection={tab.Icon && <tab.Icon className={classes.icon} />}
                                    rightSection={
                                        tab.canBeClosed && (
                                            <CloseButton
                                                size="sm"
                                                onClick={(e) => closeBook(e, tab)}
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
        ));
};
