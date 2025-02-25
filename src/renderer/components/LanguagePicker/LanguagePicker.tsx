import React, { useState } from "react";
import { UnstyledButton, Menu, Image, Group } from "@mantine/core";
import { type Icon, IconChevronDown } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { observer } from "mobx-react-lite";

import classes from "./LanguagePicker.module.css";

export type Selection = { label: string; image: string; Icon?: Icon };

interface ImageOrIconProps {
    image: Selection["image"];
    Icon: Selection["Icon"] | undefined;
    className?: string;
}

const ImageOrIcon = observer(({ Icon, image, className }: ImageOrIconProps) => {
    if (Icon) return <Icon className={className} />;
    else return <Image className={className} src={image} />;
});

interface LanguagePickerProps {
    data: Selection[];
    selected: Selection;
    onSelect: (...args: any[]) => void;
}
export const LanguagePicker = observer(({ data, selected, onSelect }: LanguagePickerProps) => {
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
            onClick={() => onSelect(item)}
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
});
