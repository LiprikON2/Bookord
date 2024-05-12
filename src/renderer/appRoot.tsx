import React, { useMemo } from "react";
import {
    MantineProvider,
    ColorSchemeScript,
    mergeThemeOverrides,
    useComputedColorScheme,
} from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "@tanstack/react-router";
import { ContextMenuProvider } from "mantine-contextmenu";
import { observer } from "mobx-react-lite";
import { generateColors } from "@mantine/colors-generator";
import { configure } from "mobx";

import { isDev } from "~/common/helpers";
import { RootStoreContextProvider, useSettingsStore } from "./stores";
import { baseTheme } from "./theme";
import "@mantine/core/styles.layer.css";
import "@mantine/dropzone/styles.layer.css";
import "@mantine/notifications/styles.layer.css";
import "@mantine/spotlight/styles.layer.css";
import "mantine-contextmenu/styles.layer.css";
import "./layout.css";
import { useColorScheme } from "./hooks";
import { useLocalStorage } from "@mantine/hooks";

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

const isValidHex = (hex: string) => {
    // Match exactly 3 characters 1 or 2 times
    const reg = /^#([0-9a-f]{3}){1,2}$/i;
    return reg.test(hex);
};

export const Root = observer(() => {
    // TODO consider moving it to the route level
    // might be of use: https://tanstack.com/router/latest/docs/framework/react/guide/router-context#how-about-an-external-data-fetching-library

    const { getSetting } = useSettingsStore();
    const accentColorSetting = getSetting([
        "Appearance",
        "App colors",
        "Main app colors",
        "Accent color",
    ]);
    const darkColorSetting = getSetting([
        "Appearance",
        "App colors",
        "Main app colors",
        "Dark colors",
    ]);
    const lightColorSetting = getSetting([
        "Appearance",
        "App colors",
        "Main app colors",
        "Light colors",
    ]);

    // TODO don't affect gray colors while theme is dark and vice versa. (problem: useColorScheme relies on MantineProvider)
    const isAccentOverriden = !accentColorSetting.disabled && isValidHex(accentColorSetting.value);
    const isDarkOverriden = !darkColorSetting.disabled && isValidHex(darkColorSetting.value);
    const isLightOverriden = !lightColorSetting.disabled && isValidHex(lightColorSetting.value);

    const colorOverride = {
        colors: {
            ...(isAccentOverriden && {
                custom1: generateColors(accentColorSetting.value),
            }),
            ...(isDarkOverriden && {
                dark: generateColors(darkColorSetting.value),
            }),
            ...(isLightOverriden && {
                gray: generateColors(lightColorSetting.value),
            }),
        },

        ...(isAccentOverriden && {
            primaryColor: "custom1",
        }),
    };
    const userTheme = {
        ...colorOverride,
    };
    const appTheme = useMemo(() => mergeThemeOverrides(baseTheme, userTheme), [userTheme]);

    return (
        <>
            <ColorSchemeScript defaultColorScheme="dark" />
            <MantineProvider defaultColorScheme="dark" theme={appTheme}>
                <ContextMenuProvider>
                    <QueryClientProvider client={queryClient}>
                        {/* RootStoreContextProvider must be above StrictMode or it breaks mobx autoruns */}
                        <RootStoreContextProvider>
                            <React.StrictMode>
                                <Outlet />
                            </React.StrictMode>
                        </RootStoreContextProvider>
                    </QueryClientProvider>
                </ContextMenuProvider>
            </MantineProvider>
        </>
    );
});
