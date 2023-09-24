import React from "react";
import { Button, Stack, Tabs, rem } from "@mantine/core";
import { IconPhoto, IconMessageCircle, IconSettings } from "@tabler/icons-react";

import { useIsMobile } from "~/renderer/hooks/useIsMobile";
import classes from "./Sidebar.module.css";
import { Link } from "@tanstack/react-router";

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
                </Tabs.List>
                <Button
                    className={classes.button}
                    variant="default"
                    mt="auto"
                    value="settings"
                    leftSection={<IconSettings style={iconStyle} />}
                    styles={{
                        inner: {
                            justifyContent: "flex-start",
                        },
                    }}
                >
                    Settings
                </Button>
                <Link to="/">/Home</Link>
                <Link to="/blog">blog</Link>
            </Stack>
        </Tabs>
    );
};
