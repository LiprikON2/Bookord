import React from "react";
import { TextInput, TextInputProps } from "@mantine/core";
import { observer } from "mobx-react-lite";

interface FilterTextInputProps
    extends Omit<
        TextInputProps,
        "value" | "placeholder" | "rightSection" | "rightSectionPointerEvents"
    > {
    getValue: () => TextInputProps["value"];
    getPlaceholder: () => TextInputProps["placeholder"];
    getRightSection: () => TextInputProps["rightSection"];
    getRightSectionPointerEvents: () => TextInputProps["rightSectionPointerEvents"];
}

export const FilterTextInput = observer(
    ({
        getValue,
        getPlaceholder,
        getRightSection,
        getRightSectionPointerEvents,
        ...rest
    }: FilterTextInputProps) => {
        return (
            <TextInput
                value={getValue()}
                placeholder={getPlaceholder()}
                rightSectionPointerEvents={getRightSectionPointerEvents()}
                rightSection={getRightSection()}
                {...rest}
            />
        );
    }
);
