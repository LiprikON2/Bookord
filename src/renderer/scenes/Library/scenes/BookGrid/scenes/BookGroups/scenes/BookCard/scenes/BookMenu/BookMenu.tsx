import React from "react";
import { Menu, ActionIcon } from "@mantine/core";
import { IconMenu2, IconRobot, IconTrash } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

interface BookMenu {
    openModal: () => void;
    handleDelete: () => void;
}
export const BookMenu = observer(({ openModal, handleDelete }: BookMenu) => {
    return (
        <Menu shadow="md" width={180} position="top-end" closeOnItemClick>
            <Menu.Target>
                <ActionIcon size="3rem" aria-label="Book menu" variant="default">
                    <IconMenu2 style={{ width: "70%", height: "70%" }} stroke={1.5} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Item
                    onClick={openModal}
                    leftSection={<IconRobot style={{ width: "70%", height: "70%" }} />}
                >
                    Summary (AI)
                </Menu.Item>

                <Menu.Divider />
                <Menu.Item
                    onClick={handleDelete}
                    color="red"
                    leftSection={<IconTrash style={{ width: "70%", height: "70%" }} />}
                >
                    Delete
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
});
