import React from "react";
import { Space, Tabs, rem } from "@mantine/core";
import { IconPhoto, IconMessageCircle, IconSettings } from "@tabler/icons-react";

import { useIsMobile } from "~/renderer/hooks/useIsMobile";
import classes from "./Sidebar.module.css";

const desktopProps = { variant: "outline" };
const mobileProps = { variant: "pills" };
const iconStyle = { width: rem(12), height: rem(12) };

export const Sidebar = () => {
    const isMobile = useIsMobile();

    return (
        <Tabs
            classNames={{
                root: classes.root,
                tab: classes.tab,
            }}
            variant="outline"
            color="var(--app-bgcolor)"
            orientation="vertical"
            radius="md"
            defaultValue="gallery"
            keepMounted={false}
            {...(isMobile ? mobileProps : desktopProps)}
        >
            <Tabs.List>
                <Tabs.Tab value="gallery" leftSection={<IconPhoto style={iconStyle} />}>
                    Gallery
                </Tabs.Tab>
                <Tabs.Tab
                    mb="auto"
                    value="messages"
                    leftSection={<IconMessageCircle style={iconStyle} />}
                >
                    Messages
                </Tabs.Tab>
                <Tabs.Tab value="settings" leftSection={<IconSettings style={iconStyle} />}>
                    Settings
                </Tabs.Tab>
            </Tabs.List>

            {/* <Tabs.Panel value="gallery">Gallery tab content</Tabs.Panel>

            <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>

            <Tabs.Panel value="settings">Settings tab content</Tabs.Panel> */}
        </Tabs>
    );
};
