import React from "react";
import { Button, Space, Stack, Tabs, rem } from "@mantine/core";
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
                list: classes.list,
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
            <Stack p={0} m={0} gap={0} h="100%">
                <Tabs.List>
                    <Tabs.Tab value="gallery" leftSection={<IconPhoto style={iconStyle} />}>
                        Gallery
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="messages"
                        leftSection={<IconMessageCircle style={iconStyle} />}
                    >
                        Messages
                    </Tabs.Tab>
                    {/* <Tabs.Tab value="settings" leftSection={<IconSettings style={iconStyle} />}>
                    Settings
                </Tabs.Tab> */}
                </Tabs.List>
                <Button
                    className={classes.button}
                    mt="auto"
                    value="settings"
                    leftSection={<IconSettings style={iconStyle} />}
                >
                    Settings
                </Button>
            </Stack>

            {/* <Tabs.Panel value="gallery">Gallery tab content</Tabs.Panel>

            <Tabs.Panel value="messages">Messages tab content</Tabs.Panel>

            <Tabs.Panel value="settings">Settings tab content</Tabs.Panel> */}
        </Tabs>
    );
};
