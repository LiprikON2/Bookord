import { action, observable, autorun, set, toJS } from "mobx";
import _ from "lodash";

import { isDev } from "~/common/helpers";
import { MappedSettingsMarkup, type SettingsState } from "~/renderer/scenes/Settings";

declare global {
    interface Window {
        settingsStore?: typeof settingsStore;
    }
}

const settingsStore = observable<SettingsState>({});
let isInitialized = false;
const settingsStoreKey = "settingsStore";

/**
 * [tabHeading, tab, sectionMarkup, label]
 */
export const getSetting = action((settingKeyList: string[]) => {
    const nestedValue = settingKeyList.reduce((obj: any, k: any) => obj[k], settingsStore.data);
    return nestedValue;
});

const instantSetSetting = action((settingKeyList: string[], key: string, value: any) => {
    const nestedValue = settingKeyList.reduce((obj: any, k: any) => obj[k], settingsStore.data);
    nestedValue[key] = value;
});

const debounceSetSetting = _.debounce(
    (settingKeyList: string[], key: string, value: any) => {
        instantSetSetting(settingKeyList, key, value);
    },
    100,
    { maxWait: 100 }
);

export const setSetting = action(
    (settingKeyList: string[], key: string, value: any, debounce = false) => {
        if (debounce) debounceSetSetting(settingKeyList, key, value);
        else instantSetSetting(settingKeyList, key, value);
    }
);

export const getSettingsStore = (mappedSettings: MappedSettingsMarkup) => {
    if (!isInitialized) {
        const defaultSettings = getDefaultSettings(mappedSettings);
        const storedSettings = getStoredSettings()?.data ?? {};
        const initSettings = _.merge({}, defaultSettings, storedSettings);

        setSettingsStore(initSettings);
        isInitialized = true;

        autorun(
            () => {
                setStoredSettings(settingsStore);

                console.log("[Update]:", settingsStoreKey);
                if (isDev()) window["settingsStore"] = toJS(settingsStore);
            },
            { delay: 200 }
        );
    }

    return settingsStore;
};

export const setSettingsStore = action((state: SettingsState) => set(settingsStore, "data", state));

const getStoredSettings = () => {
    return JSON.parse(localStorage.getItem(settingsStoreKey));
};

const setStoredSettings = (state: SettingsState) => {
    localStorage.setItem(settingsStoreKey, JSON.stringify(toJS(state)));
};

const getDefaultSettings = (mappedSettings: MappedSettingsMarkup) => {
    return Object.fromEntries(
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
                                            disabled: true,
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
};
