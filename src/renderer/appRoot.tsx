import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";
import { ContextMenuProvider } from "mantine-contextmenu";
import { observer } from "mobx-react-lite";
import { configure } from "mobx";

import { isDev } from "~/common/helpers";
import { RootStoreContextProvider } from "./stores";
import { baseTheme } from "./theme";
import "@mantine/core/styles.layer.css";
import "@mantine/dropzone/styles.layer.css";
import "@mantine/notifications/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";
import "mantine-contextmenu/styles.layer.css";
import "./layout.css";

console.log("[Renderer]: Execution started");
const queryClient = new QueryClient();

if (isDev() && true)
    configure({
        enforceActions: "always",
        computedRequiresReaction: true,
        observableRequiresReaction: true,
        disableErrorBoundaries: true,

        // Not very useful
        // ref: https://github.com/mobxjs/mobx/issues/3770#issue-1936475670
        reactionRequiresObservable: false,
    });

export const Root = observer(() => {
    // TODO consider moving it to the route level
    // might be of use: https://tanstack.com/router/latest/docs/framework/react/guide/router-context#how-about-an-external-data-fetching-library

    return (
        <>
            <ColorSchemeScript defaultColorScheme="dark" />
            <MantineProvider defaultColorScheme="dark" theme={baseTheme}>
                <ContextMenuProvider>
                    <QueryClientProvider client={queryClient}>
                        {/* RootStoreContextProvider must be above StrictMode or it breaks mobx autoruns */}
                        <RootStoreContextProvider>
                            {/* <React.StrictMode> */}
                            <Outlet />
                            {/* </React.StrictMode> */}
                        </RootStoreContextProvider>
                    </QueryClientProvider>
                </ContextMenuProvider>
            </MantineProvider>
        </>
    );
});
