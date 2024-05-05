import React from "react";
import { Container } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { useBookViewStore } from "~/renderer/stores";
import { DetailedTitle } from "~/renderer/components/";
import { BookGrid } from "./scenes";

export const Library = observer(() => {
    const bookViewStore = useBookViewStore();

    return (
        <Container px="lg" py="md" h="100%">
            <DetailedTitle size="lg" getTitle={() => bookViewStore.getFilterTitle(["recent"])} />
            <BookGrid />
        </Container>
    );
});
