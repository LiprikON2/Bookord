import { type SettingsMarkup } from "../Settings";

interface MappedSettingsMarkup {
    [k: string]: {
        [k: string]: {
            [k: string]: SettingsMarkup;
        };
    };
}

export const useProcessMarkup = (settingsMarkup: SettingsMarkup) => {
    /**
     * All settings
     * https://i.imgur.com/wN9niG1.png
     */

    const tabHeadings = [...new Set(settingsMarkup.map((setting) => setting.tabHeading))];
    /**
     * Settings per tab heading
     * https://i.imgur.com/yA09Vw6.png
     */
    const settingsPerTabHeading = Object.fromEntries(
        tabHeadings.map((tabHeading) => [
            tabHeading,
            settingsMarkup.filter((setting) => setting.tabHeading === tabHeading),
        ])
    );

    const tabs = [...new Set(settingsMarkup.map((setting) => setting.tab))];
    /**
     * Settings per tab heading, per tab
     * https://i.imgur.com/NyWtcfg.png
     */
    const settingsPerTab = Object.fromEntries(
        Object.entries(settingsPerTabHeading).map(([tabHeading, tabHeadingSettings]) => [
            tabHeading,
            Object.fromEntries(
                tabs.map((tab) => [
                    tab,
                    tabHeadingSettings.filter((setting) => setting.tab === tab),
                ])
            ),
        ])
    );

    const sections = [...new Set(settingsMarkup.map((setting) => setting.section))];
    /**
     * Settings per tab heading, per tab, per section
     * https://i.imgur.com/An3HpLr.png
     */
    const settingsPerSection: MappedSettingsMarkup = Object.fromEntries(
        Object.entries(settingsPerTab).map(([tabHeading, tabHeadingSettings]) => [
            tabHeading,
            Object.fromEntries(
                Object.entries(tabHeadingSettings)
                    .map(([tab, tabSettings]) => [
                        tab,
                        Object.fromEntries(
                            sections
                                .map((section) => [
                                    section,
                                    tabSettings.filter((setting) => setting.section === section),
                                ])
                                .filter(([_, settings]) => settings.length)
                        ),
                    ])
                    .filter(([_, settings]) => Object.values(settings).length)
            ),
        ])
    );

    const sorter = (key: string, order: string[]) => {
        return (a: any, b: any) => order.indexOf(a[key]) - order.indexOf(b[key]);
    };

    return { mappedSettings: settingsPerSection, tabHeadings, tabs, sections, sorter };
};
