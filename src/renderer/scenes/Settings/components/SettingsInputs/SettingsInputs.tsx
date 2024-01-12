import React from "react";
import { observer } from "mobx-react-lite";

import { type SettingsMarkup } from "../../Settings";
import { getInputStateProps } from "./utils";

export const SettingsInputs = observer(
    ({ isLoading, settings }: { isLoading: boolean; settings: SettingsMarkup }) => {
        if (isLoading) return <>Loading...</>;

        return settings.map(({ Input, ...setting }) => {
            const keyList = [setting.tabHeading, setting.tab, setting.section, setting.label];

            const inputMarkupProps = {
                key: keyList.join(""),
                label: setting.label,
                description: setting.description,
                placeholder: setting.placeholder,
                maw: "18rem",
            };

            const [NarrowedInput, inputStateProps] = getInputStateProps({
                Input,
                ...setting,
            });

            return <NarrowedInput {...inputMarkupProps} {...inputStateProps} />;
        });
    }
);
