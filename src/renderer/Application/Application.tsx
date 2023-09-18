import React, { useEffect } from "react";
import { About } from "./About";
import { Button, Center, Container, Space } from "@mantine/core";

import context from "~/main/mainContextApi";
import { useColorScheme } from "../hooks";
import "./Application.css";

const getTest = async () => {
    const res = await context.test();
    return res;
};

export const Application = () => {
    const { dark, setColorScheme } = useColorScheme();

    /**
     * On Dark theme change
     */
    useEffect(() => {
        if (dark) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
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
