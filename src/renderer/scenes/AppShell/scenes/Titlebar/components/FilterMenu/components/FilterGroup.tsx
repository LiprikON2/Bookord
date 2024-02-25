import { Group, Menu } from "@mantine/core";
import React from "react";

import { ToggleButton } from "~/renderer/components";

type FilterGroupProps = {
    label: string;
    items: string[];
    setItem: (label: string, item: string, value: boolean) => void;
    className: string;
};

export const FilterGroup = ({ label, items, setItem, ...rest }: FilterGroupProps) => {
    return (
        <Group gap={0} {...rest}>
            <Menu.Label>{label}</Menu.Label>
            {items.map((item) => (
                <Menu.Item
                    key={item}
                    renderRoot={(props) => (
                        <ToggleButton {...props} onClick={(on) => setItem(label, item, on)} />
                    )}
                >
                    {item}
                </Menu.Item>
            ))}
        </Group>
    );
};
