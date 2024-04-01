import React from "react";
import { Box, Container } from "@mantine/core";

import { DetailedTitle } from "~/renderer/components";
import { BookGrid } from "./scenes";
import { useBooks, useStorageBooks } from "~/renderer/hooks";
import { bookStore } from "~/renderer/store";

export const Library = () => {
    // const { searchTerm, bookCount, filteredBookCount } = useBooks();
    return (
        <Box p="md" h="100%">
            <Container p="lg" pt={0} h="100%">
                {/* <DetailedTitle size="lg">
                    {searchTerm
                        ? `Results for '${searchTerm}'`
                        : bookCount === filteredBookCount
                        ? `All books (${bookCount})`
                        : `Filtered books (${filteredBookCount})`}
                </DetailedTitle> */}
                <BookGrid />
            </Container>
        </Box>
    );
};
