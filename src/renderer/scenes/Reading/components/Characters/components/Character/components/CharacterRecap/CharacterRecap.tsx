import React from "react";
import { Group, Modal, Title, rem } from "@mantine/core";
import { IconNotes } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { Person } from "~/renderer/stores";
import { CharacterRecapBox } from "./components";

interface CharacterRecapProps {
    person: Person;
    opened?: boolean;
    onClose?: () => void;
}

export const CharacterRecap = observer(
    ({ opened = false, person, onClose }: CharacterRecapProps) => {
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
                        <IconNotes style={{ width: rem(20), height: rem(20) }} strokeWidth={2.5} />
                        <Title order={1} size="h4" fw={600}>
                            {`Recap of ${person.displayName} character`}
                        </Title>
                    </Group>
                }
                opened={opened}
                onClose={onClose}
            >
                <CharacterRecapBox person={person} />
            </Modal>
        );
    }
);
