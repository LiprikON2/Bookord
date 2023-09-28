import React from "react";
import {
    Container,
    Tabs,
    type TextInput,
    type Switch,
    type Autocomplete,
    type ColorInput,
} from "@mantine/core";

type NoInfer<T> = [T][T extends any ? 0 : 1];

const asMyArray = <T extends readonly any[]>(
    x: [...{ [K in keyof T]: { key1: T[K]; key2: NoInfer<T[K]> } }]
) => x;

// interface SettingInputMarkup {
//     Input: InputTypes;
//     defaultValue: React.ComponentProps<InputTypes>["value"];
// }
interface SettingTextInputMarkup {
    Input: typeof TextInput;
    defaultValue: React.ComponentProps<typeof TextInput>["value"];
}
interface SettingColorInputMarkup {
    Input: typeof ColorInput;
    defaultValue: React.ComponentProps<typeof ColorInput>["value"];
}
interface SettingSwitchMarkup {
    Input: typeof Switch;
    defaultValue: React.ComponentProps<typeof Switch>["value"];
}
interface SettingAutocompleteMarkup {
    Input: typeof Autocomplete;
    defaultValue: React.ComponentProps<typeof Autocomplete>["value"];
}
type SettingInputMarkup<T> = T extends typeof TextInput
    ? SettingTextInputMarkup
    : T extends typeof ColorInput
    ? SettingColorInputMarkup
    : T extends typeof Switch
    ? SettingSwitchMarkup
    : T extends typeof Autocomplete
    ? SettingAutocompleteMarkup
    : never;

type InputTypes = typeof TextInput | typeof ColorInput | typeof Switch | typeof Autocomplete;
// interface SettingDescriptionMarkup extends SettingInputMarkup {
interface SettingDescriptionMarkup {
    name: string;
    description: string;
    hoverDescription: string;
    canBeDisabled: boolean;
    Icon: () => React.ReactNode;

    Input: InputTypes;
    defaultValue: React.ComponentProps<InputTypes>["value"];
}
export interface SettingMarkup extends SettingDescriptionMarkup {
    section: string;
    category: string;
    subsettings?: SettingDescriptionMarkup[];
}

interface SettingsProps {
    settingsMarkup: SettingMarkup[];
}

export const Settings = ({ settingsMarkup }: SettingsProps) => {
    const markup = settingsMarkup[0];
    // const setting = settings[markup.section][markup.name];
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
                    <Container p="xs">Gallery tab content </Container>
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
};
