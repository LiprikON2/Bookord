import React from "react";
import { Menu, ActionIcon, MenuItemProps } from "@mantine/core";
import { type Icon, IconMenu2 } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

interface BookMenuItem {
    Icon: Icon;
    label: string;
    onClick?: () => void;
    onClose?: () => void;
    props?: MenuItemProps;
    dividerBefore?: boolean;
}
interface BookMenu {
    items: BookMenuItem[];
}
const iconStyle = { width: "70%", height: "70%" };

export const BookMenu = observer(({ items }: BookMenu) => {
    return (
        <Menu shadow="md" width={180} position="top-end" closeOnItemClick>
            <Menu.Target>
                <ActionIcon size="3rem" aria-label="Book menu" variant="default">
                    <IconMenu2 style={iconStyle} stroke={1.5} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                {items.map((item) => (
                    <React.Fragment key={item.label}>
                        <Menu.Item
                            onClick={item.onClick}
                            leftSection={<item.Icon style={iconStyle} />}
                            {...item.props}
                        >
                            {item.label}
                        </Menu.Item>
                        {item.dividerBefore && <Menu.Divider />}
                    </React.Fragment>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
});
