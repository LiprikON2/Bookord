import React, { useState } from "react";
import { UnstyledButton, Menu, Image, Group } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import classes from "./LanguagePicker.module.css";

type Selection = { label: string; image: string };
export const LanguagePicker = ({
    data,
    selected,
    setSelected,
}: {
    data: Selection[];
    selected: Selection;
    setSelected: (...args: any[]) => void;
}) => {
    const [opened, setOpened] = useState(false);
    const items = data.map((item) => (
        <Menu.Item
            leftSection={item.image && <Image src={item.image} width={18} height={18} />}
            onClick={() => setSelected(item)}
            key={item.label}
        >
            {item.label}
        </Menu.Item>
    ));

    return (
        <Menu
            onOpen={() => setOpened(true)}
            onClose={() => setOpened(false)}
            radius="md"
            width="target"
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
                    <Group gap="xs">
                        <Image src={selected.image} width={22} height={22} />
                        <span className={classes.label}>{selected.label}</span>
                    </Group>
                    <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
        </Menu>
    );
};
