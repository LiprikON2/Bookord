import React from "react";
import { Box, Container } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { DetailedTitle } from "~/renderer/components/";
import { BookGrid } from "./scenes";
import {
    useBookViewStore,
    useFilterTags,
    useFilterTitle,
    useFilteredBooks,
} from "~/renderer/stores";

export const Library = observer(() => {
    const { bookGroups, isBookStorageEmpty } = useFilteredBooks();
    const bookViewStore = useBookViewStore();

    return (
        <Container px="lg" py="md" h="100%">
            <DetailedTitle size="lg" getTitle={() => bookViewStore.filterTitle} />
            <BookGrid bookGroups={bookGroups} isBookStorageEmpty={isBookStorageEmpty} />
        </Container>
    );
});
