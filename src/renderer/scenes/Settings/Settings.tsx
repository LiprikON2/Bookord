import React, { useState } from "react";
import {
    Container,
    Tabs,
    type TextInput,
    Switch,
    type Autocomplete,
    type ColorInput,
} from "@mantine/core";

type InputTypes = typeof TextInput | typeof ColorInput | typeof Switch | typeof Autocomplete;
interface SettingMarkup {
    name: string;
    description: string;
    hoverDescription: string;
    canBeDisabled: boolean;
    Icon: () => React.ReactNode;

    Input: InputTypes;
    defaultValue?: React.ComponentProps<InputTypes>["defaultValue"];
    defaultChecked?: React.ComponentProps<InputTypes>["defaultChecked"];
}

interface RootSettingMarkup extends SettingMarkup {
    section: string;
    category: string;
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

const test: SettingsState = {
    test: {
        value: "yes",
        subsettings: {
            subtest: {
                value: "yes",
            },
        },
    },
};

export const Settings = ({ settingsMarkup }: { settingsMarkup: RootSettingMarkup[] }) => {
    // const markup = settingsMarkup[0];
    // const setting = settings[markup.section][markup.name];
    const [checked, setChecked] = useState(false);
    return (
        <Container p="xs">
            <Tabs variant="outline" orientation="vertical" defaultValue="gallery">
                <Tabs.List>
                    <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
                    <Tabs.Tab value="gallery2">Gallery Some</Tabs.Tab>
                    <Tabs.Tab value="gallery3">Test</Tabs.Tab>
                    <Tabs.Tab value="gallery4">Long title</Tabs.Tab>
                    <Tabs.Tab value="gallery5">Another</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="gallery">
                    <Container p="xs">
                        Gallery tab content
                        <Switch
                            checked={checked}
                            onChange={(event) => setChecked(event.currentTarget.checked)}
                        />
                    </Container>
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
};
