import React from "react";
import { Box, Button, Container, Group, rem } from "@mantine/core";

import { DetailedTitle } from "~/renderer/components";
import { BookGrid } from "./scenes";
import { useBooks } from "~/renderer/hooks";

export const Library = () => {
    const { searchTerm, bookCount, filteredBookCount } = useBooks();

    return (
        <Box p="md" h="100%">
            {/* <Group>
                <Button variant="default-alt">First</Button>
                <Button variant="default-alt">Second</Button>
                <Button variant="default-subtle">Third</Button>
            </Group> */}
            <Container p="lg" pt={0} h="100%">
                <DetailedTitle size="lg">
                    {searchTerm
                        ? `Results for '${searchTerm}'`
                        : bookCount === filteredBookCount
                        ? `All books (${bookCount})`
                        : `Filtered books (${filteredBookCount})`}
                </DetailedTitle>
                <BookGrid />
            </Container>
        </Box>
    );
};
