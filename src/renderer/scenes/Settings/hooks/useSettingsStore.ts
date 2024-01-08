import { useLayoutEffect } from "react";

import {
    setSettingChecked,
    setSettingValue,
    setSettingsStore,
    settingsStore,
} from "~/renderer/store";
import { useMapSettings } from ".";
import { SettingsMarkup } from "../Settings";

export const useSettingsStore = (settingsMarkup: SettingsMarkup) => {
    const { mappedSettings } = useMapSettings(settingsMarkup);

    const isLoading = !Object.values(settingsStore).length;

    useLayoutEffect(() => {
        if (isLoading) {
            const initSettings = Object.fromEntries(
                Object.entries(mappedSettings).map(([tabHeading, settings]) => [
                    tabHeading,
                    Object.fromEntries(
                        Object.entries(settings).map(([tab, settings]) => [
                            tab,
                            Object.fromEntries(
                                Object.entries(settings).map(([section, settings]) => [
                                    section,
                                    Object.fromEntries(
                                        settings.map((setting) => {
                                            if (
                                                !("defaultValue" in setting) &&
                                                !("defaultChecked" in setting)
                                            )
                                                throw Error(
                                                    "SettingsMarkup: either defaultValue or defaultChecked must be set"
                                                );
                                            return [
                                                setting.label,
                                                {
                                                    disabled: false,
                                                    ...("defaultValue" in setting && {
                                                        value: undefined,
                                                    }),
                                                    ...("defaultChecked" in setting && {
                                                        checked: undefined,
                                                    }),
                                                },
                                            ];
                                        })
                                    ),
                                ])
                            ),
                        ])
                    ),
                ])
            );
            setSettingsStore(initSettings);
        }
    }, []);

    return { settingsStore, setSettingsStore, setSettingChecked, setSettingValue, isLoading };
};
