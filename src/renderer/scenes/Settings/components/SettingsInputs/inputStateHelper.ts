import { TextInput } from "@mantine/core";
import { ComponentType } from "react";
import {
    ValueInputTypes,
    type CheckedInputTypes,
    type InputTypes,
    type RootSettingMarkup,
} from "~/renderer/scenes/Settings";
import { getSetting, setSetting } from "~/renderer/store";

type ComponentProps<T> = T extends ComponentType<infer P> ? P : never;
type MyComponentProps = ComponentProps<CheckedInputTypes>;

const getKeyList = (setting: Omit<RootSettingMarkup, "Input">) => {
    return [setting.tabHeading, setting.tab, setting.section, setting.label];
};

export const getInputStateProps = ({ Input, ...setting }: RootSettingMarkup) => {
    const keyList = getKeyList(setting);

    // let NarrowedInput: CheckedInputTypes | ValueInputTypes | typeof TextInput;
    let inputStateProps:
        | {
              disabled: boolean;
              defaultChecked: boolean;
              checked: boolean;
              onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
          }
        | {
              disabled: boolean;
              value: string;
              onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
          };

    // TODO use type narrowing instead
    if ("defaultChecked" in setting) {
        // NarrowedInput = Input as CheckedInputTypes;

        inputStateProps = {
            disabled: getSetting(keyList).disabled,
            defaultChecked: setting.defaultChecked,
            checked: getSetting(keyList).checked,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                setSetting(keyList, "checked", event.currentTarget.checked),
        };
    } else if ("defaultValue" in setting) {
        if (Input.displayName === "@mantine/core/TextInput") {
            // NarrowedInput = Input as typeof TextInput;

            inputStateProps = {
                disabled: getSetting(keyList).disabled,
                value: getSetting(keyList).value,
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                    setSetting(keyList, "value", event.currentTarget.value),
            };
        } else {
            // NarrowedInput = Input as ValueInputTypes;

            inputStateProps = {
                disabled: getSetting(keyList).disabled,
                value: getSetting(keyList).value,
                onChange: (value: any) => setSetting(keyList, "value", value),
            };
        }
    }
    return [Input, inputStateProps] as [typeof TextInput, typeof inputStateProps];
};

export const isDefault = (setting: Omit<RootSettingMarkup, "Input">) => {
    const keyList = getKeyList(setting);

    if ("defaultChecked" in setting) {
        return setting.defaultChecked === getSetting(keyList).checked;
    } else if ("defaultValue" in setting) {
        return setting.defaultValue === getSetting(keyList).value;
    }
};

export const resetToDefaults = (setting: Omit<RootSettingMarkup, "Input">) => {
    const keyList = getKeyList(setting);

    if ("defaultChecked" in setting) {
        setSetting(keyList, "checked", setting.defaultChecked);
    } else if ("defaultValue" in setting) {
        setSetting(keyList, "value", setting.defaultValue);
    }
};
