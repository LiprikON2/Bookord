import { Button } from "@mantine/core";
import { IconCirclePlus } from "@tabler/icons-react";
import React from "react";
import context from "~/renderer/ipc/fileOperations";

import classes from "./AddBooksButton.module.css";
interface AddBooksButtonProps {}

export const AddBooksButton = ({}: AddBooksButtonProps) => {
    const openFileDialog = async () => {
        const distinctFileCount = await context.openFileDialog();
    };
    return (
        <Button
            onClick={openFileDialog}
            leftSection={<IconCirclePlus className={classes.icon} />}
            variant="outline"
            mx="xs"
        >
            Add books
        </Button>
    );
};
