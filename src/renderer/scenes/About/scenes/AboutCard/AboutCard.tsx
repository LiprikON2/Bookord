import React from "react";
import { observer } from "mobx-react-lite";

import { Versions } from "./components";
import { useAppVersion } from "./hooks";

export const AboutCard = observer(() => {
    const bookordVersion = useAppVersion();
    return (
        <Versions>
            <Versions.Item type="bookordCircle" name="bookord" version={bookordVersion} />
            <Versions.Item type="electron" />
            <Versions.Item type="chrome" />
            <Versions.Item type="license" />
        </Versions>
    );
});
