import React from "react";
import { Container, ScrollArea, Tabs, rem } from "@mantine/core";

import { type SettingsMarkup } from "../Settings";
import { useMapSettings } from "../hooks";

export const SettingsPanels = ({
    settingsMarkup,
    classNames,
    children,
}: {
    settingsMarkup: SettingsMarkup;
    classNames: {
        panel: string;
    };
    children: (settings: { [section: string]: SettingsMarkup }) => React.ReactNode;
}) => {
    const { mappedSettings, tabHeadings, tabs, sorter } = useMapSettings(settingsMarkup);

    return Object.entries(mappedSettings)
        .sort(sorter("tabHeading", tabHeadings))
        .map(([tabHeading, settings]) =>
            Object.entries(settings)
                .sort(sorter("tab", tabs))
                .map(([tab, settings]) => (
                    <Tabs.Panel
                        className={classNames.panel}
                        key={tabHeading + tab}
                        value={tabHeading + tab}
                    >
                        <ScrollArea
                            h="100%"
                            type="auto"
                            offsetScrollbars
                            styles={{ scrollbar: { margin: "-1px", marginTop: rem(8) } }}
                        >
                            <Container p="lg" px="xl">
                                {children(settings)}
                            </Container>
                        </ScrollArea>
                    </Tabs.Panel>
                ))
        );
};
