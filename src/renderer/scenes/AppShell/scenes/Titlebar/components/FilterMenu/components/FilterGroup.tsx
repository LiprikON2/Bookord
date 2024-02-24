import { Group, Menu } from "@mantine/core";
import React from "react";

import { ToggleButton } from "~/renderer/components";

export const FilterGroup = ({ label = "", items = [] as string[], ...rest }) => {
    return (
        <Group gap={0} {...rest}>
            <Menu.Label>{label}</Menu.Label>
            {items.map((item) => (
                <Menu.Item key={item} component={ToggleButton}>
                    {item}
                </Menu.Item>
            ))}
        </Group>
    );
};
