import React from "react";
import { Stack } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { type SettingsMarkup } from "../Settings";
import { useMapSettings } from "../hooks";
import { DetailedTitle } from "~/renderer/components";

export const SettingsSections = observer(
    ({
        settingsMarkup,
        children,
        settings,
    }: {
        settingsMarkup: SettingsMarkup;
        children: (settings: SettingsMarkup) => React.ReactNode;
        settings: { [section: string]: SettingsMarkup };
    }) => {
        const { sections, sorter } = useMapSettings(settingsMarkup);

        return Object.entries(settings)
            .sort(sorter("section", sections))
            .map(([section, settings]) => {
                const { SectionIcon, sectionDescription, tabHeading, tab } = settings[0];
                return (
                    <React.Fragment key={tabHeading + tab + section}>
                        <DetailedTitle
                            getTitle={() => section}
                            size="lg"
                            description={sectionDescription}
                            Icon={SectionIcon}
                        />
                        <Stack pt="lg" pb="xl" gap="md">
                            {children(settings)}
                        </Stack>
                    </React.Fragment>
                );
            });
    }
);
