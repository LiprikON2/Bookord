import React from "react";
import { observer } from "mobx-react-lite";
import { Checkbox, Flex, Text, Group, Stack } from "@mantine/core";

import { type SettingsMarkup } from "../../Settings";
import {
    getInputStateProps,
    isDefault,
    resetToDefaults,
    getInputDisableProps,
    getKeyList,
} from "./inputStateHelper";
import { ResetButton } from "./components";
// import classes from "./SettingsInput.module.css";

export const SettingsInputs = observer(
    ({ isLoading, settings }: { isLoading: boolean; settings: SettingsMarkup }) => {
        if (isLoading) return <>Loading...</>;

        return settings.map(({ Input, ...setting }) => {
            const inputDisableProps = getInputDisableProps(setting);
            const isDisabled = setting.canBeDisabled && !inputDisableProps.checked;

            const inputMarkupProps = {
                label: setting.canBeDisabled ? (
                    <Group>
                        <Checkbox size="md" variant="outline" {...inputDisableProps} />
                        <span>
                            {setting.canBeDisabled && <Text span>Override </Text>}
                            <Text
                                span
                                {...(isDisabled && { c: "dimmed" })}
                                style={{
                                    textTransform: setting.canBeDisabled ? "lowercase" : "none",
                                }}
                            >
                                {setting.label}
                            </Text>
                        </span>
                    </Group>
                ) : (
                    setting.label
                ),
                ...(setting.description && {
                    description: setting.description,
                }),

                placeholder: setting.placeholder,
                maw: "18rem",
            };

            const [NarrowedInput, inputStateProps] = getInputStateProps({
                Input,
                ...setting,
            });

            const isResetHidden = isDisabled || isDefault(setting);

            return (
                <Flex align="center" gap="sm" key={getKeyList(setting).join("/")}>
                    <ResetButton hidden={isResetHidden} onClick={() => resetToDefaults(setting)} />
                    <NarrowedInput
                        // styles={{
                        //     ...(isDisabled && {
                        //         label: { color: "var(--mantine-color-dimmed)" },
                        //     }),
                        // }}
                        {...inputMarkupProps}
                        {...inputStateProps}
                    />
                </Flex>
            );
        });
    }
);
