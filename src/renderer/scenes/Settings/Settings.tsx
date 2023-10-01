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
} from "@mantine/core";

import { useProcessMarkup } from "./hooks";
import classes from "./Settings.module.css";

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
    tabHeading: string;
    tab: string;
    section: string;
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
    const [checked, setChecked] = useState(false);

    const { mappedSettings, tabHeadings, tabs, sections, sorter } =
        useProcessMarkup(settingsMarkup);

    return (
        <Container p="xs" h="100%">
            <Tabs variant="outline" orientation="vertical" defaultValue={tabHeadings[0] + tabs[0]}>
                <Tabs.List my="md" h="unset" mr={-0.5}>
                    {Object.entries(mappedSettings)
                        .sort(sorter("tabHeading", tabHeadings))
                        .map(([tabHeading, settings]) => (
                            <React.Fragment key={tabHeading}>
                                <Text className={classes.tabHeading} c="dimmed">
                                    {tabHeading}
                                </Text>
                                {Object.entries(settings)
                                    .sort(sorter("tab", tabs))
                                    .map(([tab]) => (
                                        <Tabs.Tab key={tabHeading + tab} value={tabHeading + tab}>
                                            {tab}
                                        </Tabs.Tab>
                                    ))}
                            </React.Fragment>
                        ))}
                </Tabs.List>

                {Object.entries(mappedSettings)
                    .sort(sorter("tabHeading", tabHeadings))
                    .map(([tabHeading, settings]) =>
                        Object.entries(settings)
                            .sort(sorter("tab", tabs))
                            .map(([tab, settings]) => (
                                <Tabs.Panel
                                    className={classes.panel}
                                    key={tabHeading + tab}
                                    value={tabHeading + tab}
                                >
                                    <Container p="xs">
                                        {Object.entries(settings)
                                            .sort(sorter("section", sections))
                                            .map(([section, settings]) => (
                                                <React.Fragment key={tabHeading + tab + section}>
                                                    <Title order={4}>{section}</Title>
                                                    {settings.map(({ name }) => (
                                                        <>{name}</>
                                                    ))}
                                                    here are settings, such as...
                                                </React.Fragment>
                                            ))}
                                    </Container>
                                </Tabs.Panel>
                            ))
                    )}

                {/* <Tabs.Panel value="gallery">
                    <Container p="xs">
                        Gallery tab content
                        <Switch
                            checked={checked}
                            onChange={(event) => setChecked(event.currentTarget.checked)}
                        />
                    </Container>
                </Tabs.Panel> */}
            </Tabs>
        </Container>
    );
};
