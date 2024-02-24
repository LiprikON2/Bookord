import React from "react";
import { ActionIcon, Box, Button, Container, Group, rem } from "@mantine/core";
import { IconClock, IconClockFilled, IconFilter, IconFilterFilled } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { DetailedTitle, ToggleActionIcon } from "~/renderer/components";
import { BookGrid } from "./scenes";
import { useBooks } from "~/renderer/hooks";

export const Library = observer(() => {
    const { searchTerm, booksCount } = useBooks();

    return (
        <Box p="md" h="100%">
            <Group>
                <Button variant="default-alt">First</Button>
                <Button variant="default-alt">Second</Button>
                <Button variant="default-subtle">Third</Button>
            </Group>
            <Container py="lg" h="100%">
                <DetailedTitle size="lg">
                    {searchTerm ? `Results for '${searchTerm}'` : `All books (${booksCount})`}
                </DetailedTitle>
                <BookGrid />
            </Container>
        </Box>
    );
});
