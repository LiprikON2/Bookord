import { getSetting, getSettingsStore, setSetting } from "~/renderer/stores";
import { useMapSettings } from ".";
import { SettingsMarkup } from "../Settings";

export const useSettingsStore = (settingsMarkup: SettingsMarkup) => {
    const { mappedSettings } = useMapSettings(settingsMarkup);
    const store = getSettingsStore(mappedSettings);
    const isLoading = !Object.keys(store.data ?? {}).length;

    return { setSetting, getSetting, isLoading };
};
