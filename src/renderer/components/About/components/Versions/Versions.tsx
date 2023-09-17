import React from "react";
import { Group } from "@mantine/core";

import { Item } from "./components";

const Versions = ({ children }: { children: React.ReactNode }) => {
    return (
        <Group
            position="apart"
            spacing="md"
            my={0}
            mx="auto"
            style={{
                borderRadius: "10px",
                width: "80%",
                boxShadow: "0 0 20px inset rgb(0 0 0 / 3%)",
            }}
        >
            {children}
        </Group>
    );
};

Versions.Item = Item;

export { Versions };
