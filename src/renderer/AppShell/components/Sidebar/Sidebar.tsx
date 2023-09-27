import React from "react";
import { Button, Stack, Tabs, rem } from "@mantine/core";
import { IconPhoto, IconMessageCircle, IconSettings } from "@tabler/icons-react";

import { useIsMobile } from "~/renderer/hooks/useIsMobile";
import classes from "./Sidebar.module.css";
import { useNavigate } from "@tanstack/react-router";
import { libraryRoute, testRoute } from "~/renderer/appRenderer";

type SidebarLocation = typeof libraryRoute.to | typeof testRoute.to;

const desktopProps = { variant: "outline" };
const mobileProps = { variant: "pills" };
const iconStyle = { width: rem(16), height: rem(16) };

export const Sidebar = () => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    return (
        <Tabs
            classNames={{
                root: classes.root,
                list: classes.list,
                tab: classes.tab,
            }}
            variant="outline"
            orientation="vertical"
            radius="md"
            defaultValue={libraryRoute.to}
            keepMounted={true}
            onChange={(to: SidebarLocation) => navigate({ from: "/", to })}
            {...(isMobile ? mobileProps : desktopProps)}
        >
            <Stack p={0} m={0} gap={0} h="100%">
                <Tabs.List>
                    <Tabs.Tab
                        value={libraryRoute.to}
                        role="link"
                        leftSection={<IconPhoto style={iconStyle} />}
                    >
                        Library
                    </Tabs.Tab>
                    <Tabs.Tab
                        value={testRoute.to}
                        role="link"
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
            </Stack>
        </Tabs>
    );
};
