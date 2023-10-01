import React from "react";
import { Tabs, Text } from "@mantine/core";

import { useMapSettings } from "../hooks";
import { SettingsMarkup } from "../Settings";

export const SettingsTabs = ({
    settingsMarkup,
    classNames,
}: {
    settingsMarkup: SettingsMarkup;
    classNames: {
        tabHeading: string;
    };
}) => {
    const { mappedSettings, tabHeadings, tabs, sorter } = useMapSettings(settingsMarkup);

    return Object.entries(mappedSettings)
        .sort(sorter("tabHeading", tabHeadings))
        .map(([tabHeading, settings]) => (
            <React.Fragment key={tabHeading}>
                <Text className={classNames.tabHeading} c="dimmed">
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
        ));
};
