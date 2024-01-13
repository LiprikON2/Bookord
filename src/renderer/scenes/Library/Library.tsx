import React from "react";
import { Container } from "@mantine/core";

import { DetailedTitle } from "~/renderer/components";
import { BookGrid } from "./scenes/";

export const Library = () => {
    return (
        <Container p="lg">
            <DetailedTitle size="lg" description="Manage your books.">
                Library
            </DetailedTitle>
            <BookGrid />
        </Container>
    );
};
