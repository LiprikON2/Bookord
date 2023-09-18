import React from "react";
import { Group } from "@mantine/core";

import { Item } from "./components";

const Versions = ({ children }: { children: React.ReactNode }) => {
    return (
        <Group
            justify="apart"
            gap="md"
            my={0}
            mx="auto"
            style={{
                width: "80%",
            }}
        >
            {children}
        </Group>
    );
};

Versions.Item = Item;

export { Versions };
