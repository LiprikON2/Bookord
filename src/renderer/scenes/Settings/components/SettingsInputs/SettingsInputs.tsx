import React from "react";
import { observer } from "mobx-react-lite";

import { type SettingsMarkup } from "../../Settings";
import { getInputStateProps, isDefault, resetToDefaults } from ".";
import { ResetButton } from "./components";
import { Flex } from "@mantine/core";

export const SettingsInputs = observer(
    ({ isLoading, settings }: { isLoading: boolean; settings: SettingsMarkup }) => {
        if (isLoading) return <>Loading...</>;

        return settings.map(({ Input, ...setting }) => {
            const keyList = [setting.tabHeading, setting.tab, setting.section, setting.label];

            const inputMarkupProps = {
                key: keyList.join("/"),
                label: setting.label,
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
            const isResetHidden = isDefault(setting);

            return (
                <Flex align="center" gap="sm">
                    <ResetButton hidden={isResetHidden} onClick={() => resetToDefaults(setting)} />
                    <NarrowedInput {...inputMarkupProps} {...inputStateProps} />
                </Flex>
            );
        });
    }
);
