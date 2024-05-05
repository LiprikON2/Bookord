import React, { useState } from "react";
import { Stack, Tabs } from "@mantine/core";
import { useNavigate, useParams } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";

import { useBookStore } from "~/renderer/stores";
import { useHistory, useIsMobile } from "~/renderer/hooks";
import { TextObserver } from "~/renderer/components";
import { Params, SidebarInnerTab, SidebarMarkup, SidebarTab } from "../../Sidebar";
import { TabsList } from "./components";
import classes from "./PanelTabsContent.module.css";

interface PanelTabsContentProps {
    markup: SidebarMarkup;
    outerTab: ArrayElement<SidebarMarkup>;
    onChangeTab: () => void;
}

const desktopProps = { variant: "outline" };
const mobileProps = { variant: "pills" };

export const PanelTabsContent = observer(
    ({ markup, outerTab, onChangeTab }: PanelTabsContentProps) => {
        const bookStore = useBookStore();

        const isMobile = useIsMobile();
        const navigate = useNavigate();
        const params: Params = useParams({ strict: false });

        const closeBook = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, tab: SidebarTab) => {
            e.stopPropagation();

            const bookKey = tab.navParams?.params;
            if (!bookKey) return;

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
        };

        const { currentPath } = useHistory();
        const [activeInnerTab, setActiveInnerTab] = useState(decodeURIComponent(currentPath));
        const [previousInnerTab, setPreviousInnerTab] = useState<string | null>(null);

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
                        <TextObserver className={classes.tabHeading} c="dimmed">
                            {() => innerTab.tabHeading}
                        </TextObserver>
                        <TabsList getInnerTabs={() => innerTab.tabs} onTabClose={closeBook} />
                        {/* TODO add a skeleton tab */}
                    </Stack>
                </Tabs>
            ));
    }
);
