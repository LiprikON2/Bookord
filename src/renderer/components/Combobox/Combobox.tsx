import React from "react";
import { UnstyledButton, Menu, Group } from "@mantine/core";
import { type Icon, IconChevronDown } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { observer } from "mobx-react-lite";

import classes from "./Combobox.module.css";

interface DataItem {
    value: string;
    label: string;
    image?: string;
    Icon?: Icon;
}

type ItemDisplayProps = {
    item: DataItem;
    className?: string;
};

const ItemDisplay = observer(({ item, className }: ItemDisplayProps) => {
    if (item.Icon) {
        return <item.Icon className={className} />;
    }
    if (item.image) {
        return <img src={item.image} alt={item.label} className={className} />;
    }

    return null;
});

interface ComboboxProps {
    data: DataItem[];
    selected: string;
    onChange: (value: string) => void;
}

export const Combobox = observer(({ data, selected, onChange }: ComboboxProps) => {
    const [opened, { open, close }] = useDisclosure(false);

    const selectedItem = data.find((item) => item.value === selected);

    return (
        <Menu onOpen={open} onClose={close} radius="md" width="target" withinPortal>
            <Menu.Target>
                <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
                    <Group gap="xs">
                        <ItemDisplay item={selectedItem} className={classes.leftIconBig} />
                        <span className={classes.label}>{selectedItem.label}</span>
                    </Group>
                    <IconChevronDown className={classes.icon} stroke={1.5} />
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                {data.map((item) => (
                    <Menu.Item
                        leftSection={<ItemDisplay item={item} className={classes.leftIconSmall} />}
                        onClick={() => onChange(item.value)}
                        key={item.label}
                    >
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
});
