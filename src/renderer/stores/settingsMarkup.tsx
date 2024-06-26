import React from "react";
import { Anchor, Code, ColorInput, PasswordInput, Switch, TextInput } from "@mantine/core";
import { type SettingsMarkup } from "~/renderer/scenes/Settings";
import {
    IconAdjustments,
    IconLanguage,
    IconPalette,
    IconRobot,
    IconRocket,
    IconTypography,
    type TablerIconsProps,
} from "@tabler/icons-react";

import classes from "./settingsMarkup.module.css";

const sectionIconProps: TablerIconsProps = {
    className: classes.sectionIcon,
};

// TODO refactor it in style of LayoutLibrary.tsx, since objects do not ensure key order
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
        sectionDescription: "Style the look and feel of the app.",
    },
    AI: {
        section: "AI",
        SectionIcon: () => <IconRobot {...sectionIconProps} />,
        sectionDescription: "API keys for AI-related external services.",
    },
    Language: {
        section: "Language",
        SectionIcon: () => <IconLanguage {...sectionIconProps} />,
        sectionDescription: "API keys for language-related external services.",
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
        label: "Yandex Cloud Oauth Token",
        description: (
            <>
                You can get it{" "}
                <Anchor
                    inherit
                    href="https://oauth.yandex.com/authorize?response_type=token&client_id=1a6990aa636648e9b2ef855fa7bec2fb"
                    target="_blank"
                >
                    here
                </Anchor>
                . It stays valid for a year.
            </>
        ),
        placeholder: "Enter your Oauth token here",
        hoverDescription: "",
        tabHeading: "General",
        tab: "API",
        ...sectionMarkup["AI"],

        Input: PasswordInput,
        defaultValue: "",
        canBeDisabled: false,
    },
    {
        label: "Yandex Cloud folder ID",
        description: (
            <>
                ID of the folder for which your account has the{" "}
                <Code c="dimmed">ai.languageModels.user</Code>.
                <br />
                You can create it by following 3 steps in{" "}
                <Anchor
                    inherit
                    href="https://yandex.cloud/en/docs/foundation-models/quickstart/yandexgpt#before-begin"
                    target="_blank"
                >
                    getting started
                </Anchor>
                .
            </>
        ),
        placeholder: "Enter your folder ID here",
        hoverDescription: "",
        tabHeading: "General",
        tab: "API",
        ...sectionMarkup["AI"],

        Input: PasswordInput,
        defaultValue: "",
        canBeDisabled: false,
    },

    {
        label: "DeepL API key",
        description: "Key used by translation service",
        placeholder: "Enter your API key here",
        hoverDescription: "",
        tabHeading: "General",
        tab: "API",
        ...sectionMarkup["Language"],

        Input: PasswordInput,
        defaultValue: "",
        canBeDisabled: false,
    },

    {
        label: "Accent color",
        description: "The color of accented elements.",
        placeholder: "#FD7E14",
        hoverDescription: "",
        tabHeading: "Appearance",
        tab: "App colors",
        ...sectionMarkup["Main app colors"],

        Input: ColorInput,
        defaultValue: "#FD7E14",
        canBeDisabled: true,
    },
    {
        label: "Dark colors",
        description: "Used to generate background shades on the dark theme.",
        placeholder: "#202020",
        hoverDescription: "",
        tabHeading: "Appearance",
        tab: "App colors",
        ...sectionMarkup["Main app colors"],

        Input: ColorInput,
        defaultValue: "#202020",
        canBeDisabled: true,
    },
    {
        label: "Light colors",
        description: "Used to generates background shades on the light theme.",
        placeholder: "#868E96",
        hoverDescription: "",
        tabHeading: "Appearance",
        tab: "App colors",
        ...sectionMarkup["Main app colors"],

        Input: ColorInput,
        defaultValue: "#868E96",
        canBeDisabled: true,
    },
];
