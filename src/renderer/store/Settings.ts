import { observable, set } from "mobx";

import { type SettingsState } from "~/renderer/scenes/Settings";

// export const settings = observable<SettingsState>({});
export const settingsStore = observable<{ data: SettingsState }>({ data: {} }).data;

export const setSettingsStore = (state: SettingsState) => set(settingsStore, "data", state);
export const setSettingValue = (key: string, value: string) => set(settingsStore, key, value);
export const setSettingChecked = (key: string, checked: boolean) =>
    set(settingsStore, key, checked);
