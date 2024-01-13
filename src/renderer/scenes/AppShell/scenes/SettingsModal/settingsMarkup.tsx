import React from "react";
import { ColorInput, Switch, TextInput } from "@mantine/core";
import { type SettingsMarkup } from "~/renderer/scenes/Settings";
import {
    IconAdjustments,
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
};

export const settingsMarkup: SettingsMarkup = [
    {
        label: "Reopen last book on startup",
        description: "",
        placeholder: "Huh",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Startup"],

        Input: Switch,
        defaultChecked: false,
        canBeDisabled: false,
    },
    {
        label: "Reopen last book on startup",
        description: "",
        placeholder: "Huh",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: Switch,
        defaultChecked: false,
        canBeDisabled: false,
    },

    {
        label: "Reopen last book on startup123",
        description: "",
        placeholder: "Huh",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: Switch,
        defaultChecked: false,
        canBeDisabled: false,
    },

    {
        label: "Reopen last book on startup222",
        description: "",
        placeholder: "Huh",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: Switch,
        defaultChecked: false,
        canBeDisabled: false,
    },

    {
        label: "Reopen last book on startup22",
        description: "",
        placeholder: "Huh",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: Switch,
        defaultChecked: false,
        canBeDisabled: false,
    },
    {
        label: "Accent color",
        description: "This is a description",
        placeholder: "#ffffff",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: true,
    },
    {
        label: "Accent color43",
        description: "TODO",
        placeholder: "#ffffff",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: false,
    },
    {
        label: "Accent color34",
        description: "TODO",
        placeholder: "#ffffff",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: false,
    },
    {
        label: "Accent color s43",
        description: "TODO",
        placeholder: "#ffffff",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: false,
    },
    {
        label: "Accent color42",
        description: "TODO",
        placeholder: "#ffffff",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: false,
    },
    {
        label: "Accent color21212112",
        description: "TODO",
        placeholder: "#ffffff",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: false,
    },
    {
        label: "Accent color2112211221",
        description: "TODO",
        placeholder: "#ffffff",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: false,
    },
    {
        label: "Accent color211212",
        description: "TODO",
        placeholder: "#ffffff",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: false,
    },
    {
        label: "Accent color21122",
        description: "TODO",
        placeholder: "#ffffff",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: false,
    },
    {
        label: "Accent color21",
        description: "TODO",
        placeholder: "#ffffff",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: false,
    },
    {
        label: "Accent color1212",
        description: "TODO",
        placeholder: "#ffffff",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: false,
    },
    {
        label: "Accent color 22",
        description: "TODO",
        placeholder: "#ffffff",
        hoverDescription: "Whether or not app will open last read book on startup.",
        tabHeading: "Main heading",
        tab: "App Settings",
        ...sectionMarkup["Font"],

        Input: ColorInput,
        defaultValue: "#fff",
        canBeDisabled: false,
    },

    {
        label: "Accent color",
        description: "TODO",
        placeholder: "TEtxt",
        hoverDescription: "ss",
        Input: TextInput,
        SectionIcon: () => <span>t</span>,
        canBeDisabled: false,
        defaultValue: "#fff",
        tabHeading: "sd",
        tab: "asdf",
        section: "asdf",
        sectionDescription: "What happens at launch?",
    },

    {
        tabHeading: "Options",
        tab: "Editor",
        section: "General",
        sectionDescription: "What happens at launch?",

        SectionIcon: IconAdjustments,
        label: "ONE",
        placeholder: "COLOR",
        description: "",
        defaultValue: "",
        hoverDescription: "",
        Input: ColorInput,
        canBeDisabled: false,
    },
    {
        tabHeading: "Options",
        tab: "Editor",
        section: "General",
        sectionDescription: "What happens at launch?",

        SectionIcon: IconAdjustments,
        label: "TWO",
        placeholder: "Coflr",
        description: "",
        hoverDescription: "",
        defaultValue: "",
        Input: ColorInput,
        canBeDisabled: false,
    },
    {
        tabHeading: "Options",
        tab: "Files & Links",
        section: "Unnamed",
        sectionDescription: "What happens at launch?",

        SectionIcon: IconAdjustments,
        label: "THREE",
        placeholder: "colr",
        description: "",
        hoverDescription: "",
        defaultValue: "",

        Input: ColorInput,
        canBeDisabled: false,
    },
    {
        tabHeading: "Core Plugins",
        tab: "Files & Links",
        section: "Unnamed",
        sectionDescription: "What happens at launch?",

        SectionIcon: IconAdjustments,
        label: "FOUR",
        placeholder: "COLCOUR",
        description: "",
        defaultValue: "",

        hoverDescription: "",
        Input: ColorInput,
        canBeDisabled: false,
    },
];
