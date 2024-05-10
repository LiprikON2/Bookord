import React, { useState } from "react";
import {
    Text,
    Collapse,
    Container,
    SegmentedControl,
    Stack,
    Group,
    ActionIcon,
} from "@mantine/core";
import { randomId, useDisclosure } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import {
    IconAdjustmentsHorizontal,
    IconSortAscending2,
    IconSortDescending2,
} from "@tabler/icons-react";

import { useBookViewStore } from "~/renderer/stores";
import { DetailedTitle } from "~/renderer/components/";
import { BookGrid } from "./scenes";

export const Library = observer(() => {
    const bookViewStore = useBookViewStore();
    const [opened, { toggle }] = useDisclosure(false);

    // ref(bug): https://github.com/mantinedev/mantine/issues/6116#issuecomment-2071796202
    const [key1, setKey1] = useState(randomId());
    const [key2, setKey2] = useState(randomId());
    const updateSegmentedControls = () => {
        setKey1(randomId());
        setKey2(randomId());
    };

    return (
        <Container px="lg" py="md" h="100%">
            <DetailedTitle
                size="lg"
                getTitle={() => bookViewStore.getFilterTitle(["recent"])}
                rightSection={
                    <ActionIcon
                        color="gray"
                        variant="subtle"
                        aria-label="Adjust grouping"
                        onClick={() => {
                            updateSegmentedControls();
                            toggle();
                        }}
                    >
                        <IconAdjustmentsHorizontal
                            style={{ width: "90%", height: "90%" }}
                            stroke={1.5}
                        />
                    </ActionIcon>
                }
            />
            <Collapse in={opened}>
                <Group justify="space-between" my="xs">
                    <Stack gap={0}>
                        <Group justify="space-between" m={4}>
                            <Text size="sm" fw={500}>
                                Sort by
                            </Text>
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="gray"
                                title={`Toggle ${bookViewStore.sort}`}
                                onClick={bookViewStore.toggleSort}
                            >
                                {bookViewStore.sort === "ascending" && (
                                    <IconSortAscending2
                                        style={{ width: "70%", height: "70%" }}
                                        stroke={2}
                                    />
                                )}
                                {bookViewStore.sort === "descending" && (
                                    <IconSortDescending2
                                        style={{ width: "70%", height: "70%" }}
                                        stroke={2}
                                    />
                                )}
                            </ActionIcon>
                        </Group>
                        <SegmentedControl
                            key={key1}
                            size="sm"
                            value={bookViewStore.sortBy}
                            onChange={bookViewStore.setSortBy}
                            data={bookViewStore.sortByNames}
                        />
                    </Stack>
                    <Stack gap={0}>
                        <Group justify="space-between" m={4}>
                            <Text size="sm" fw={500}>
                                Group by
                            </Text>
                            <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="gray"
                                title={`Toggle ${bookViewStore.sort}`}
                                onClick={bookViewStore.toggleGroupSort}
                            >
                                {bookViewStore.groupSort === "ascending" && (
                                    <IconSortAscending2
                                        style={{ width: "70%", height: "70%" }}
                                        stroke={2}
                                    />
                                )}
                                {bookViewStore.groupSort === "descending" && (
                                    <IconSortDescending2
                                        style={{ width: "70%", height: "70%" }}
                                        stroke={2}
                                    />
                                )}
                            </ActionIcon>
                        </Group>
                        <SegmentedControl
                            key={key2}
                            size="sm"
                            value={bookViewStore.groupBy}
                            onChange={bookViewStore.setGroupBy}
                            data={bookViewStore.groupByNames}
                        />
                    </Stack>
                </Group>
            </Collapse>
            <BookGrid />
        </Container>
    );
});
