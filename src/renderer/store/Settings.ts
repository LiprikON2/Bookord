import { action, has, observable, set, toJS } from "mobx";

import { type SettingsState } from "~/renderer/scenes/Settings";

export const settingsStore = observable<SettingsState>({});

export const setInitStore = action((state: SettingsState) => set(settingsStore, "data", state));

export const setSetting = action((settingKeyList: string[], key: string, value: any) => {
    const nestedValue = settingKeyList.reduce((obj: any, k: any) => obj[k], settingsStore.data);
    nestedValue[key] = value;
    // console.log("set", key, "to", toJS(value));
});

export const getSetting = action((settingKeyList: string[]) => {
    const nestedValue = settingKeyList.reduce((obj: any, k: any) => obj[k], settingsStore.data);
    // console.log("get", settingKeyList[settingKeyList.length - 1], "is", toJS(nestedValue));
    return nestedValue;
});
