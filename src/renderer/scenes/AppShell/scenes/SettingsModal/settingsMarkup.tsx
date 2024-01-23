import React from "react";
import { ColorInput, PasswordInput, Switch, TextInput } from "@mantine/core";
import { type SettingsMarkup } from "~/renderer/scenes/Settings";
import {
    IconAdjustments,
    IconPalette,
    IconRobot,
    IconRocket,
    IconTypography,
    type TablerIconsProps,
} from "@tabler/icons-react";

import classes from "./SettingsModal.module.css";

const sectionIconProps: TablerIconsProps = {
    className: classes.sectionIcon,
};
const sectionMarkup = {
    Startup: {
        section: "Startup",
        SectionIcon: () => <IconRocket {...sectionIconProps} />,
        sectionDescription: "What happens at launch?",
    },
    Font: {
        section: "Font",
        SectionIcon: () => <IconTypography {...sectionIconProps} />,
        sectionDescription: "Style the look and size of the text.",
    },
    "Main app colors": {
        section: "Main app colors",
        SectionIcon: () => <IconPalette {...sectionIconProps} />,
        sectionDescription: "Style the look and size of the text.",
    },
    AI: {
        section: "AI",
        SectionIcon: () => <IconRobot {...sectionIconProps} />,
        sectionDescription: "API keys for AI-related external services.",
    },
};

export const settingsMarkup: SettingsMarkup = [
    {
        label: "Reopen last book on startup",
        description: "",
        placeholder: "",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "General",
        tab: "App Settings",
        ...sectionMarkup["Startup"],

        Input: Switch,
        defaultChecked: false,
        canBeDisabled: false,
    },
    {
        label: "YandexGPT API IAM token",
        description: "IAM token for Yandex account",
        placeholder: "t1.9euelZrInYuez5eckonHkJuZz5yZke...",
        hoverDescription: "",
        tabHeading: "General",
        tab: "API",
        ...sectionMarkup["AI"],

        Input: PasswordInput,
        defaultValue: "",
        canBeDisabled: false,
    },
    {
        label: "YandexGPT API folder ID",
        description:
            "ID of the folder for which your account has the ai.languageModels.user or higher role",
        placeholder: "b1ggvd02ucrri...",
        hoverDescription: "",
        tabHeading: "General",
        tab: "API",
        ...sectionMarkup["AI"],

        Input: PasswordInput,
        defaultValue: "",
        canBeDisabled: false,
    },

    {
        label: "Accent color",
        description: "The color of accented elements.",
        placeholder: "#ffffff",
        hoverDescription: "",
        tabHeading: "Appearance",
        tab: "App colors",
        ...sectionMarkup["Main app colors"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: true,
    },
];
