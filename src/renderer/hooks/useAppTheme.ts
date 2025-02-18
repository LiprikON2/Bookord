import { useMemo } from "react";
import { mergeThemeOverrides } from "@mantine/core";
import { generateColors } from "@mantine/colors-generator";

import { useSettingsStore } from "../stores";
import { baseTheme } from "../theme";

const isValidHex = (hex: string) => {
    // Match exactly 3 characters 1 or 2 times
    const reg = /^#([0-9a-f]{3}){1,2}$/i;
    return reg.test(hex);
};

export const useAppTheme = () => {
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

    return appTheme;
};
