import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";
import { ContextMenuProvider } from "mantine-contextmenu";
import { configure } from "mobx";

import { useUpdateBookStore } from "./stores";
import { isDev } from "~/common/helpers";
import { baseTheme } from "./theme";
import "@mantine/core/styles.layer.css";
import "@mantine/dropzone/styles.layer.css";
import "@mantine/notifications/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";
import "mantine-contextmenu/styles.layer.css";
import "./layout.css";
import { RootStoreContextProvider } from "./stores/RootStoreContext";

console.log("[Renderer]: Execution started");
const queryClient = new QueryClient();

if (isDev() && false)
    configure({
        enforceActions: "always",
        computedRequiresReaction: true,
        reactionRequiresObservable: true,
        observableRequiresReaction: true,
        disableErrorBoundaries: true,
    });

export const Root = () => {
    // TODO consider moving it to the route level
    // might be of use: https://tanstack.com/router/latest/docs/framework/react/guide/router-context#how-about-an-external-data-fetching-library

    return (
        <>
            <ColorSchemeScript defaultColorScheme="dark" />
            <MantineProvider defaultColorScheme="dark" theme={baseTheme}>
                <ContextMenuProvider>
                    <QueryClientProvider client={queryClient}>
                        <RootStoreContextProvider>
                            <Outlet />
                        </RootStoreContextProvider>
                    </QueryClientProvider>
                </ContextMenuProvider>
            </MantineProvider>
        </>
    );
};
