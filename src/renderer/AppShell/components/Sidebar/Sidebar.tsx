import React from "react";
import { Stack, Tabs } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";

import { useIsMobile } from "~/renderer/hooks/useIsMobile";
import classes from "./Sidebar.module.css";
import { Bottom } from "./components";

type Link = {
    to: string; // TODO change to the inferred type
    name: string;
    Icon: ({ className }: { className: string }) => React.JSX.Element;
};

const desktopProps = { variant: "outline" };
const mobileProps = { variant: "pills" };

const Sidebar = ({ links, children }: { links: Link[]; children: React.ReactNode }) => {
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
            defaultValue={links[0].to}
            keepMounted={true}
            onChange={(to: any) => navigate({ to })}
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
