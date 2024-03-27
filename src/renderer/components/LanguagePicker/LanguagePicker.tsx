import React, { useState } from "react";
import { UnstyledButton, Menu, Image, Group } from "@mantine/core";
import { type Icon, IconChevronDown } from "@tabler/icons-react";
import classes from "./LanguagePicker.module.css";
import { useDisclosure } from "@mantine/hooks";

type Selection = { label: string; image: string; Icon?: Icon };

const ImageOrIcon = ({
    Icon,
    image,
    className,
}: {
    image: Selection["image"];
    Icon: Selection["Icon"] | undefined;
    className?: string;
}) => {
    if (Icon) return <Icon className={className} />;
    else return <Image className={className} src={image} />;
};
export const LanguagePicker = ({
    data,
    selected,
    setSelected,
}: {
    data: Selection[];
    selected: Selection;
    setSelected: (...args: any[]) => void;
}) => {
    const [opened, { open, close }] = useDisclosure(false);

    const items = data.map((item) => (
        <Menu.Item
            leftSection={
                <ImageOrIcon
                    Icon={item.Icon}
                    image={item.image}
                    className={classes.leftIconSmall}
                />
            }
            onClick={() => setSelected(item)}
            key={item.label}
        >
            {item.label}
        </Menu.Item>
    ));

    return (
        <Menu onOpen={open} onClose={close} radius="md" width="target" withinPortal>
            <Menu.Target>
                <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
                    <Group gap="xs">
                        <ImageOrIcon
                            Icon={selected.Icon}
                            image={selected.image}
                            className={classes.leftIconBig}
                        />

                        <span className={classes.label}>{selected.label}</span>
                    </Group>
                    <IconChevronDown className={classes.icon} stroke={1.5} />
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
        </Menu>
    );
};
