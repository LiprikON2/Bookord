import React from "react";
import { observer } from "mobx-react-lite";

import { type CheckedInputTypes, type SettingsMarkup } from "../Settings";
import { useSettingsStore } from "../hooks";
import { TextInput } from "@mantine/core";

export const SettingsInputs = observer(
    ({
        settingsMarkup,
        settings,
    }: {
        settingsMarkup: SettingsMarkup;
        settings: SettingsMarkup;
    }) => {
        const { setSetting, getSetting, isLoading } = useSettingsStore(settingsMarkup);

        if (isLoading) return <>Loading...</>;

        return settings.map(({ Input, ...setting }) => {
            const keyList = [setting.tabHeading, setting.tab, setting.section, setting.label];

            const inputMarkupProps = {
                key: keyList.join(""),
                label: setting.label,
                description: setting.description,
                placeholder: setting.placeholder,
            };

            // TODO use type narrowing
            if ("defaultChecked" in setting) {
                Input = Input as CheckedInputTypes;
                return (
                    <Input
                        {...inputMarkupProps}
                        defaultChecked={setting.defaultChecked}
                        checked={getSetting(keyList).checked}
                        disabled={getSetting(keyList).disabled}
                        onChange={(event) =>
                            setSetting(keyList, "checked", event.currentTarget.checked)
                        }
                    />
                );
            } else if ("defaultValue" in setting) {
                if (Input.displayName === "@mantine/core/TextInput") {
                    Input = Input as typeof TextInput;
                    // TODO this is not DRY
                    return (
                        <Input
                            {...inputMarkupProps}
                            value={getSetting(keyList).value}
                            disabled={getSetting(keyList).disabled}
                            onChange={(event) =>
                                setSetting(keyList, "value", event.currentTarget.value)
                            }
                        />
                    );
                } else {
                    // TODO this is not DRY
                    return (
                        <Input
                            {...inputMarkupProps}
                            value={getSetting(keyList).value}
                            disabled={getSetting(keyList).disabled}
                            onChange={(value) => setSetting(keyList, "value", value)}
                        />
                    );
                }
            }
        });
    }
);
