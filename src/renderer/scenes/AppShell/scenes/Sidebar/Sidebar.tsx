import React from "react";
import { Stack, Tabs } from "@mantine/core";
import { type ToOptions, useNavigate } from "@tanstack/react-router";

import { useIsMobile } from "~/renderer/hooks/useIsMobile";
import { Bottom } from "./components";
import { useHistory } from "~/renderer/hooks";
import classes from "./Sidebar.module.css";

export type TabLink = {
    to: ToOptions["to"];
    name: string;
    Icon: ({ className }: { className: string }) => React.JSX.Element;
};

const desktopProps = { variant: "outline" };
const mobileProps = { variant: "pills" };

const Sidebar = ({
    links,
    close,
    children,
}: {
    links: TabLink[];
    close: () => void;
    children: React.ReactNode;
}) => {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { currentPath } = useHistory();

    const changeTab = (to: any) => {
        navigate({ to });
        close();
    };

    return (
        <Tabs
            classNames={{ root: classes.root }}
            defaultValue={currentPath}
            keepMounted={true}
            onChange={changeTab}
            {...(isMobile ? mobileProps : desktopProps)}
        >
            <Stack p={0} m={0} gap={0} h="100%">
                <Tabs.List>
                    {links.map((link) => (
                        <Tabs.Tab
                            key={link.to}
                            value={link.to}
                            role="link"
                            leftSection={<link.Icon className={classes.icon} />}
                        >
                            {link.name}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
                {children}
            </Stack>
        </Tabs>
    );
};

Sidebar.Bottom = Bottom;

export { Sidebar };
