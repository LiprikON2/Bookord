import React from "react";
import { ScrollArea, rem } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";

import { AppShell } from "~/renderer/scenes";

export const LayoutLibrary = () => {
    return (
        <AppShell>
            <ScrollArea
                h="100%"
                type="auto"
                styles={{ scrollbar: { margin: "-1px", marginTop: rem(8) } }}
            >
                <Outlet />
            </ScrollArea>
        </AppShell>
    );
};
