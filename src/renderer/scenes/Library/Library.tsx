import React from "react";
import { Box, Button, Container, Group } from "@mantine/core";

import { DetailedTitle } from "~/renderer/components";
import { BookGrid } from "./scenes";
import { useBooks } from "~/renderer/hooks";

export const Library = () => {
    const { searchTerm, bookCount } = useBooks();

    return (
        <Box p="md" h="100%">
            <Group>
                <Button variant="default-alt">First</Button>
                <Button variant="default-alt">Second</Button>
                <Button variant="default-subtle">Third</Button>
            </Group>
            <Container py="lg" h="100%">
                <DetailedTitle size="lg">
                    {searchTerm ? `Results for '${searchTerm}'` : `All books (${bookCount})`}
                </DetailedTitle>
                <BookGrid />
            </Container>
        </Box>
    );
};
