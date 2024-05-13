import React from "react";
import { Title, Group, rem, Modal } from "@mantine/core";
import { IconRobot } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { SummaryBox } from "./components";

interface SummaryModalProps {
    getTitle: () => string;
    getAuthor: () => string;
    opened: boolean;
    onClose?: () => void;
}

// TODO persist summaries https://tanstack.com/query/v4/docs/react/plugins/persistQueryClient
export const SummaryModal = observer(
    ({ opened = false, getTitle, getAuthor, onClose }: SummaryModalProps) => {
        const title = getTitle();

        return (
            <Modal
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
                title={
                    <Group p={0}>
                        <IconRobot style={{ width: rem(20), height: rem(20) }} strokeWidth={2.5} />
                        <Title order={1} size="h4" fw={600}>
                            {`Summary of ${title} book`}
                        </Title>
                    </Group>
                }
                opened={opened}
                onClose={onClose}
            >
                <SummaryBox getTitle={getTitle} getAuthor={getAuthor} />
            </Modal>
        );
    }
);
