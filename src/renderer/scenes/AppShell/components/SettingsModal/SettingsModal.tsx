import React from "react";
import { Button, Group, Modal, Title, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSettings } from "@tabler/icons-react";
import clsx from "clsx";

import { Settings } from "~/renderer/scenes";
import classes from "./SettingsModal.module.css";
import { settingsMarkup } from "./settingsMarkup";

export const SettingsModal = ({
    classNames,
}: {
    classNames?: { button?: string; buttonIcon?: string; modalIcon?: string };
}) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Button
                className={classNames?.button}
                variant="default"
                mt="auto"
                value="settings"
                fw="normal"
                leftSection={
                    <IconSettings
                        className={clsx(classes.buttonIcon, classNames?.buttonIcon)}
                        strokeWidth={1.5}
                    />
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
            <Modal
                title={
                    <Group p={0}>
                        <IconSettings
                            className={clsx(classes.modalIcon, classNames?.modalIcon)}
                            strokeWidth={2.5}
                        />
                        <Title order={1} size="h4" fw={600}>
                            Settings
                        </Title>
                    </Group>
                }
                opened={opened}
                onClose={close}
                styles={{
                    body: {
                        height: `calc(100% - ${rem(64)})`,
                    },
                    header: {
                        padding: "var(--mantine-spacing-xs)",
                    },
                    title: {
                        paddingLeft: "var(--mantine-spacing-md)",
                    },
                }}
            >
                <Settings settingsMarkup={settingsMarkup} />
            </Modal>
        </>
    );
};
