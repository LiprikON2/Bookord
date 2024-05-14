import React from "react";
import { observer } from "mobx-react-lite";
import { Text, Group, Stack, UnstyledButton, Collapse, rem, Button } from "@mantine/core";
import { IconChevronRight, IconNotes, IconX } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

import { Person } from "~/renderer/stores";
import { CharacterAvatar, CharacterRecap } from "./components";
import classes from "./Character.module.css";

interface CharacterProps {
    person: Person;
}

export const Character = observer(({ person }: CharacterProps) => {
    const [summaryOpened, { open: openSummary, close: closeSummary }] = useDisclosure(false);

    const [collapseOpened, { toggle: toggleCollapse }] = useDisclosure(false);

    return (
        <Stack gap={4}>
            <UnstyledButton
                title={person.uniqueName}
                className={classes.user}
                onClick={() => toggleCollapse()}
            >
                <Group>
                    <CharacterAvatar seed={person.uniqueName} />

                    <div style={{ flex: 1 }}>
                        <Text size="sm" fw={500} lh={1}>
                            {person.displayName}
                        </Text>

                        <Text c="dimmed" size="xs" mt={2}>
                            {person.count} mentions
                        </Text>
                    </div>

                    <IconChevronRight style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
                </Group>
            </UnstyledButton>
            <Collapse in={collapseOpened} pl="xs">
                <Button
                    size="sm"
                    leftSection={<IconNotes className={classes.icon} />}
                    color="gray.6"
                    classNames={{ inner: classes.inner, root: classes.root }}
                    variant="subtle"
                    onClick={openSummary}
                >
                    Recap (AI)
                </Button>
                <Button
                    size="sm"
                    leftSection={<IconX className={classes.icon} />}
                    classNames={{ inner: classes.inner, root: classes.root }}
                    variant="subtle"
                    color="red.6"
                >
                    Non-person
                </Button>
            </Collapse>
            <CharacterRecap opened={summaryOpened} onClose={closeSummary} person={person} />
        </Stack>
    );
});
