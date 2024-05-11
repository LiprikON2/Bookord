import { getSetting, getSettingsStore, setSetting } from "~/renderer/stores";

import { settingsMarkup } from "../settingsMarkup";
import { useMapSettings } from "~/renderer/scenes/Settings/hooks";

export const useSettingsStore = () => {
    const { mappedSettings } = useMapSettings(settingsMarkup);
    const store = getSettingsStore(mappedSettings);
    const isLoading = !Object.keys(store.data ?? {}).length;

    return { setSetting, getSetting, isLoading, settingsMarkup };
};
