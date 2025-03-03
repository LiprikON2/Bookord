import React from "react";
import { Button } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { IconCirclePlus, IconFolder } from "@tabler/icons-react";

import context from "~/renderer/ipc/fileOperations";
import classes from "./AddBooksButton.module.css";

interface AddBooksButtonProps {}

export const AddBooksButton = observer(({}: AddBooksButtonProps) => {
    const openFileDialog = async () => {
        const distinctFileCount = await context.openFileDialog();
    };

    const openFolder = async () => {
        const isSuccess = await context.openAppDirFolder();
        console.log("isSuccess", isSuccess);
    };
    return (
        <Button.Group>
            <Button
                onClick={openFileDialog}
                leftSection={<IconCirclePlus className={classes.icon} />}
                variant="light"
                px="xs"
            >
                Add books
            </Button>
            <Button px="xs" onClick={openFolder} variant="light">
                <IconFolder className={classes.icon} />
            </Button>
        </Button.Group>
    );
});
