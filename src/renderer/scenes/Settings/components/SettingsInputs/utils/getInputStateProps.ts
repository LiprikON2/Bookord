import { TextInput } from "@mantine/core";
import { ComponentType } from "react";
import {
    type CheckedInputTypes,
    type InputTypes,
    type RootSettingMarkup,
} from "~/renderer/scenes/Settings";
import { getSetting, setSetting } from "~/renderer/store";

type ComponentProps<T> = T extends ComponentType<infer P> ? P : never;
type MyComponentProps = ComponentProps<CheckedInputTypes>;

export const getInputStateProps = ({ Input, ...setting }: RootSettingMarkup) => {
    const keyList = [setting.tabHeading, setting.tab, setting.section, setting.label];

    let NarrowedInput: InputTypes | CheckedInputTypes | typeof TextInput;
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
        NarrowedInput = Input as CheckedInputTypes;

        inputStateProps = {
            disabled: getSetting(keyList).disabled,
            defaultChecked: setting.defaultChecked,
            checked: getSetting(keyList).checked,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                setSetting(keyList, "checked", event.currentTarget.checked),
        };
    } else if ("defaultValue" in setting) {
        if (Input.displayName === "@mantine/core/TextInput") {
            NarrowedInput = Input as typeof TextInput;

            inputStateProps = {
                disabled: getSetting(keyList).disabled,
                value: getSetting(keyList).value,
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                    setSetting(keyList, "value", event.currentTarget.value),
            };
        } else {
            NarrowedInput = Input;

            inputStateProps = {
                disabled: getSetting(keyList).disabled,
                value: getSetting(keyList).value,
                onChange: (value: any) => setSetting(keyList, "value", value),
            };
        }
    }
    return [NarrowedInput, inputStateProps] as [typeof TextInput, typeof inputStateProps];
};
