import React from "react";
import { Box, Container } from "@mantine/core";

import { DetailedTitle } from "~/renderer/components/";
import { BookGrid } from "./scenes";
import { useFilterTags, useFilterTitle, useFilteredBooks } from "~/renderer/stores";

export const Library = () => {
    const { bookGroups, isBookStorageEmpty } = useFilteredBooks();

    const filterTitle = useFilterTitle();

    return (
        <>
            <Container p="lg" pt={0} h="100%">
                <DetailedTitle size="lg">{filterTitle}</DetailedTitle>
                <BookGrid bookGroups={bookGroups} isBookStorageEmpty={isBookStorageEmpty} />
            </Container>
        </>
    );
};
