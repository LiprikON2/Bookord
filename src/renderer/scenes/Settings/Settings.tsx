import React, { useState, ComponentProps } from "react";
import {
    Container,
    Tabs,
    Switch,
    type TextInput,
    type Autocomplete,
    type ColorInput,
} from "@mantine/core";
import type { Icon } from "@tabler/icons-react";

import { useMapSettings } from "./hooks";
import classes from "./Settings.module.css";
import { SettingsInputs, SettingsPanels, SettingsSections, SettingsTabs } from "./components";

export type CheckedInputTypes = typeof Switch;
export type ValueInputTypes = typeof TextInput | typeof ColorInput | typeof Autocomplete;
type InputTypes = CheckedInputTypes | ValueInputTypes;

interface SettingMarkup {
    label: string;
    placeholder: string;
    description: string;
    hoverDescription: string;
    canBeDisabled: boolean;

    Input: InputTypes;
    // defaultValue?: React.ComponentProps<InputTypes>["defaultValue"];
    // defaultChecked?: React.ComponentProps<InputTypes>["defaultChecked"];
    defaultValue?: string;
    defaultChecked?: boolean;
}

interface RootSettingMarkup extends SettingMarkup {
    tabHeading: string;
    tab: string;
    section: string;
    SectionIcon: Icon;
    subsettings?: SettingMarkup[];
}

export type SettingsMarkup = RootSettingMarkup[];

interface SettingState {
    // value?: React.ComponentProps<InputTypes>["value"];
    // checked?: React.ComponentProps<InputTypes>["checked"];
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    subsettings?: { [label: string]: SubsettingState };
}

type SubsettingState = Omit<SettingState, "subsettings">;
export interface SettingsState {
    [tabHeading: string]: {
        [tab: string]: {
            [section: string]: {
                [label: string]: SettingState;
            };
        };
    };
}

export const Settings = ({ settingsMarkup }: { settingsMarkup: SettingsMarkup }) => {
    const { tabHeadings, tabs } = useMapSettings(settingsMarkup);

    return (
        <Container p="xs" h="100%">
            <Tabs defaultValue={tabHeadings[0] + tabs[0]}>
                <Tabs.List my="md" h="unset" mr={-1}>
                    <SettingsTabs
                        classNames={{ tabHeading: classes.tabHeading }}
                        settingsMarkup={settingsMarkup}
                    />
                </Tabs.List>

                <SettingsPanels
                    classNames={{ panel: classes.panel }}
                    settingsMarkup={settingsMarkup}
                >
                    {(settings) => (
                        <SettingsSections settingsMarkup={settingsMarkup} settings={settings}>
                            {(settings) => (
                                <SettingsInputs
                                    settingsMarkup={settingsMarkup}
                                    settings={settings}
                                />
                            )}
                        </SettingsSections>
                    )}
                </SettingsPanels>
            </Tabs>
        </Container>
    );
};
