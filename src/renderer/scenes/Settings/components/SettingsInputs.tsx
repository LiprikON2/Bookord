import React from "react";
import { observer } from "mobx-react-lite";

import { type SettingsMarkup } from "../Settings";
import { useSettingsStore } from "../hooks";

export const SettingsInputs = observer(
    ({
        settingsMarkup,
        settings,
    }: {
        settingsMarkup: SettingsMarkup;
        settings: SettingsMarkup;
    }) => {
        const { settingsStore, setSettingChecked, isLoading } = useSettingsStore(settingsMarkup);
        console.log("settingsStore", settingsStore);
        if (isLoading) return <>Loading...</>;
        return settings.map(({ Input, ...setting }) => {
            const key = [setting.tabHeading, setting.tab, setting.section, setting.label].join("");

            const inputMarkupProps = {
                key: key,
                label: setting.label,
                description: setting.description,
                placeholder: setting.placeholder,
            };
            const settingState =
                settingsStore?.[setting.tabHeading]?.[setting.tab]?.[setting.section]?.[
                    setting.label
                ];
            if ("defaultChecked" in setting) {
                return (
                    <Input
                        {...inputMarkupProps}
                        checked={settingState?.checked}
                        defaultChecked={setting.defaultChecked}
                        disabled={settingState?.disabled}
                        onChange={(checked) => setSettingChecked(key, Boolean(checked))}
                    />
                );
            } else if ("defaultValue" in setting) {
                return (
                    <Input
                        {...inputMarkupProps}
                        value={settingState?.value}
                        defaultValue={setting.defaultValue}
                        disabled={settingState?.disabled}
                    />
                );
            }
        });
    }
);
