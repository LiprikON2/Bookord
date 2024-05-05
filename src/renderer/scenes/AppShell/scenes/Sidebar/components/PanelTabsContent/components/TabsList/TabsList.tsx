import React from "react";
import { CloseButton, ScrollArea, Tabs } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { SidebarTab } from "../../../../Sidebar";
import classes from "./TabsList.module.css";

interface TabsListProps {
    getInnerTabs: () => SidebarTab[];
    onTabClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, tab: SidebarTab) => void;
}

export const TabsList = observer(({ getInnerTabs, onTabClose }: TabsListProps) => {
    return (
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
                {getInnerTabs().map((tab) => (
                    <Tabs.Tab
                        component="div"
                        key={tab.id}
                        value={tab.id}
                        role="link"
                        leftSection={tab.Icon && <tab.Icon className={classes.icon} />}
                        rightSection={
                            tab.canBeClosed && (
                                <CloseButton size="sm" onClick={(e) => onTabClose(e, tab)} />
                            )
                        }
                    >
                        {tab.name}
                    </Tabs.Tab>
                ))}
            </ScrollArea>
        </Tabs.List>
    );
});
