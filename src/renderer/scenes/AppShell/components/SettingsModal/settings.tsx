import React from "react";
import { ColorInput, Switch, TextInput } from "@mantine/core";
import { SettingsMarkup } from "~/renderer/scenes/Settings";

export const settings: SettingsMarkup = [
    {
        name: "Reopen last book on startup.",
        description: "",
        hoverDescription: "Whether or not app will open last read book on startup.",
        section: "App Settings",
        category: "Startup",
        Input: Switch,
        defaultValue: "true",
        canBeDisabled: false,
        Icon: () => <span>test</span>,
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
