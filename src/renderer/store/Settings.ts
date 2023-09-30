import { observable } from "mobx";

import { type SettingsState } from "~/renderer/scenes/Settings";

// export const settings = observable<SettingsState>({});
export const settings = observable<SettingsState>({
    "Reopen last book on startup.": {
        value: "yes",
    },
});
