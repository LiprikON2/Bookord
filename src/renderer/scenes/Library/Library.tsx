import React from "react";
import { ActionIcon, Box, Button, Container, Group, rem } from "@mantine/core";
import { IconClock, IconClockFilled, IconFilter, IconFilterFilled } from "@tabler/icons-react";

import { DetailedTitle, ToggleActionIcon } from "~/renderer/components";
import { BookGrid } from "./scenes";

export const Library = () => {
    return (
        <Box p="md" h="100%">
            <Group>
                <Button variant="default-alt">First</Button>
                <Button variant="default-alt">Second</Button>
                <Button variant="default-subtle">Third</Button>

                <ToggleActionIcon
                    aria-label="Filter"
                    OnIcon={IconFilterFilled}
                    OffIcon={IconFilter}
                    onAction={() => console.log("its on")}
                    offAction={() => console.log("its off")}
                />
                <ToggleActionIcon
                    aria-label="Recent"
                    OnIcon={IconClockFilled}
                    OffIcon={IconClock}
                    onAction={() => console.log("its on")}
                    offAction={() => console.log("its off")}
                />
            </Group>
            <Container py="lg" h="100%">
                <DetailedTitle size="lg">All books (10)</DetailedTitle>
                <BookGrid />
            </Container>
        </Box>
    );
};
