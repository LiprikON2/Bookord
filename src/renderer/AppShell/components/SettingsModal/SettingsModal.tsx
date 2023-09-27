import React from "react";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSettings } from "@tabler/icons-react";
import clsx from "clsx";

import { Modal } from "~/components/Modal";
import { Settings } from "~/renderer/scenes";
import classes from "./SettingsModal.module.css";

export const SettingsModal = ({
    classNames,
}: {
    classNames?: { button?: string; buttonIcon?: string };
}) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Button
                className={clsx(classes.button, classNames?.button)}
                variant="default"
                mt="auto"
                value="settings"
                leftSection={
                    <IconSettings className={clsx(classes.buttonIcon, classNames?.buttonIcon)} />
                }
                styles={{
                    inner: {
                        justifyContent: "flex-start",
                    },
                }}
                onClick={open}
            >
                Settings
            </Button>
            <Modal title="Settings" opened={opened} close={close}>
                <Settings />
            </Modal>
        </>
    );
};
