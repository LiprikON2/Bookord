import React from "react";
import { Container, Tabs } from "@mantine/core";

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
                        <Container p="xs">{children(settings)}</Container>
                    </Tabs.Panel>
                ))
        );
};
