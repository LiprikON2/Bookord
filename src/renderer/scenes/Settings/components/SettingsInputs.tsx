import React from "react";

import { type SettingsMarkup } from "../Settings";

export const SettingsInputs = ({ settings }: { settings: SettingsMarkup }) => {
    return settings.map(({ Input, ...setting }) => (
        <Input
            key={setting.tabHeading + setting.tab + setting.section + setting.name}
            label={setting.name}
            description={setting.description}
        />
    ));
};
