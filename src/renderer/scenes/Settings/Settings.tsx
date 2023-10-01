import React, { useState } from "react";
import {
    Container,
    Tabs,
    Text,
    Switch,
    type TextInput,
    type Autocomplete,
    type ColorInput,
    Title,
    Group,
} from "@mantine/core";
import type { Icon } from "@tabler/icons-react";

import { useMapSettings } from "./hooks";
import classes from "./Settings.module.css";
import { SettingsInputs, SettingsPanels, SettingsSections, SettingsTabs } from "./components";

type InputTypes = typeof TextInput | typeof ColorInput | typeof Switch | typeof Autocomplete;
interface SettingMarkup {
    name: string;
    description: string;
    hoverDescription: string;
    canBeDisabled: boolean;

    Input: InputTypes;
    defaultValue?: React.ComponentProps<InputTypes>["defaultValue"];
    defaultChecked?: React.ComponentProps<InputTypes>["defaultChecked"];
}

interface RootSettingMarkup extends SettingMarkup {
    tabHeading: string;
    tab: string;
    section: string;
    SectionIcon: Icon;
    subsettings?: SettingMarkup[];
}

export type SettingsMarkup = RootSettingMarkup[];

interface SettingValue {
    value?: React.ComponentProps<InputTypes>["value"];
    checked?: React.ComponentProps<InputTypes>["checked"];
    disabled?: boolean;
    subsettings?: { [name: string]: SubsettingsState };
}

type SubsettingsState = Omit<SettingValue, "subsettings">;
export interface SettingsState {
    [name: string]: SettingValue;
}

export const Settings = ({ settingsMarkup }: { settingsMarkup: SettingsMarkup }) => {
    // const markup = settingsMarkup[0];
    // const setting = settings[markup.section][markup.name];

    const { tabHeadings, tabs } = useMapSettings(settingsMarkup);

    return (
        <Container p="xs" h="100%">
            <Tabs variant="outline" orientation="vertical" defaultValue={tabHeadings[0] + tabs[0]}>
                <Tabs.List my="md" h="unset" mr={-0.5}>
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
                            {(settings) => <SettingsInputs settings={settings} />}
                        </SettingsSections>
                    )}
                </SettingsPanels>
            </Tabs>
        </Container>
    );
};
