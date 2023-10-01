import React from "react";
import { Group, Title } from "@mantine/core";

import { type SettingsMarkup } from "../Settings";
import { useMapSettings } from "../hooks";

export const SettingsSections = ({
    settingsMarkup,
    children,
    settings,
}: {
    settingsMarkup: SettingsMarkup;
    children: (settings: SettingsMarkup) => React.ReactNode;
    settings: { [k: string]: SettingsMarkup };
}) => {
    const { sections, sorter } = useMapSettings(settingsMarkup);

    return Object.entries(settings)
        .sort(sorter("section", sections))
        .map(([section, settings]) => {
            const { SectionIcon, tabHeading, tab } = settings[0];
            return (
                <React.Fragment key={tabHeading + tab + section}>
                    <Group>
                        <SectionIcon />
                        <Title order={4}>{section}</Title>
                    </Group>
                    {children(settings)}
                </React.Fragment>
            );
        });
};
