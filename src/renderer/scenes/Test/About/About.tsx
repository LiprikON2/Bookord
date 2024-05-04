import React from "react";

import { Versions } from "./components/Versions";
import { observer } from "mobx-react-lite";

export const About = observer(() => {
    return (
        <Versions>
            <Versions.Item type="bookordSquare" />
            <Versions.Item type="electron" />
            <Versions.Item type="chrome" />
            <Versions.Item type="license" />
        </Versions>
    );
});
