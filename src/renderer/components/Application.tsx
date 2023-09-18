import React, { useEffect } from "react";

import context from "~/main/mainContextApi";
import { About } from "./About";
import { Button, Center, Container, Space, useMantineColorScheme } from "@mantine/core";
import "./Application.css";

const getTest = async () => {
    const res = await context.test();
    return res;
};

const Application = () => {
    const { colorScheme, setColorScheme } = useMantineColorScheme();
    const dark = colorScheme === "dark";

    useEffect(() => {
        getTest();
    }, []);

    /**
     * On Dark theme change
     */
    useEffect(() => {
        if (dark) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
        console.log("colorScheme", colorScheme);
    }, [dark]);

    /**
     * Toggle Theme
     */
    const toggleTheme = () => {
        setColorScheme(dark ? "light" : "dark");
    };

    return (
        <Container>
            <Center>
                <Button onClick={() => toggleTheme()}>Toggle Theme</Button>
            </Center>
            <Space h="md" />
            <About />
        </Container>
    );
};

export default Application;
