import React from "react";
import { Container } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { AboutCard } from "./scenes";

export const About = observer(() => {
    return (
        <Container p="xl">
            <AboutCard />
        </Container>
    );
});
