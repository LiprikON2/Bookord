import React from "react";
import { Stack, Title, Text, Flex } from "@mantine/core";

import { type SettingsMarkup } from "../Settings";
import { useMapSettings } from "../hooks";

export const SettingsSections = ({
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
                    <Flex justify="flex-start" align="center" gap="sm">
                        <SectionIcon />
                        <Stack justify="center" gap={0}>
                            <Title order={2} size="h3" fw={700}>
                                {section}
                            </Title>
                            <Text c="dimmed">{sectionDescription}</Text>
                        </Stack>
                    </Flex>
                    <Stack
                        pt="lg"
                        pb="xl"
                        // px="xs"
                        gap="md"
                    >
                        {children(settings)}
                    </Stack>
                </React.Fragment>
            );
        });
};
