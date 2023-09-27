import React from "react";
import { Modal as MantineModal } from "@mantine/core";

export const Modal = ({
    title,
    children,
    close,
    opened,
}: {
    title: string | React.ReactNode;
    children: React.ReactNode;
    close: () => void;
    opened: boolean;
}) => {
    return (
        <MantineModal.Root opened={opened} onClose={close}>
            <MantineModal.Overlay />
            <MantineModal.Content>
                <MantineModal.Header>
                    <MantineModal.Title>{title}</MantineModal.Title>
                    <MantineModal.CloseButton />
                </MantineModal.Header>
                <MantineModal.Body>{children}</MantineModal.Body>
            </MantineModal.Content>
        </MantineModal.Root>
    );
};
