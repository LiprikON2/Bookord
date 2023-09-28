import React from "react";
import { ColorInput, TextInput } from "@mantine/core";
import { SettingMarkup } from "~/renderer/scenes/Settings";

export const settings: SettingMarkup[] = [
    {
        name: "ss",
        description: "ss",
        hoverDescription: "ss",
        Input: TextInput,
        Icon: () => <span>test</span>,
        canBeDisabled: false,
        defaultValue: "ss",
        section: "",
        category: "",
    },
    {
        name: "ss",
        description: "ss",
        hoverDescription: "ss",
        Input: ColorInput,
        Icon: () => <span>test</span>,
        canBeDisabled: false,
        defaultValue: "#fff",
        section: "",
        category: "",
    },
];
