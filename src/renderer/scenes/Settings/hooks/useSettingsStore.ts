import { useEffect, useLayoutEffect } from "react";

import { getSetting, setSetting, setInitStore, settingsStore } from "~/renderer/store";
import { useMapSettings } from ".";
import { SettingsMarkup } from "../Settings";
import { toJS } from "mobx";

export const useSettingsStore = (settingsMarkup: SettingsMarkup) => {
    const { mappedSettings } = useMapSettings(settingsMarkup);

    const isLoading = !Object.values(settingsStore).length;

    // TODO make it only for dev
    useEffect(() => {
        // @ts-ignore
        window["store"] = toJS(settingsStore);
        console.log("update");
    }, [toJS(settingsStore)]);

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
                                                        // value: undefined,
                                                        value: setting["defaultValue"],
                                                    }),
                                                    ...("defaultChecked" in setting && {
                                                        // checked: undefined,
                                                        checked: setting["defaultChecked"],
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
            setInitStore(initSettings);
        }
    }, []);

    return { setSetting, getSetting, isLoading };
};
