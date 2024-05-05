import React from "react";
import { Button, Center, Container, Space } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { useColorScheme } from "~/renderer/hooks";
import { AboutCard } from "./scenes";

export const About = observer(() => {
    const { dark, setColorScheme } = useColorScheme();

    const toggleTheme = () => {
        setColorScheme(dark ? "light" : "dark");
    };

    return (
        <Container p="xl">
            {/* <Center>
                <Button onClick={() => toggleTheme()}>Toggle Theme</Button>
            </Center>
            <Space h="md" /> */}
            <AboutCard />
        </Container>
    );
});
