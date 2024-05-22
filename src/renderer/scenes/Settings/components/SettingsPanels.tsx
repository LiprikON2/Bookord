import React from "react";
import { Container, ScrollArea, Tabs, rem } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { type SettingsMarkup } from "../Settings";
import { useMapSettings } from "../hooks";

interface SettingsPanelsProps {
    settingsMarkup: SettingsMarkup;
    classNames: {
        panel: string;
    };
    children: (settings: { [section: string]: SettingsMarkup }) => React.ReactNode;
}

export const SettingsPanels = observer(
    ({ settingsMarkup, classNames, children }: SettingsPanelsProps) => {
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
                                scrollbarSize={8}
                                styles={{ scrollbar: { margin: "-1px", marginTop: rem(8) } }}
                            >
                                <Container p="lg">{children(settings)}</Container>
                            </ScrollArea>
                        </Tabs.Panel>
                    ))
            );
    }
);
