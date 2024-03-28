import React from "react";
import { Box, SimpleGrid } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";

import { useBooks } from "~/renderer/hooks";
import { BookDropzone } from "./scenes";
import { BookCard } from "./components";
import context from "./ipc";

export const BookGrid = () => {
    const { filteredBookEntries, bookEntries, hasBooks } = useBooks();

    const handleDrop = async (fileBlobs: FileWithPath[]) => {
        const files = fileBlobs.map(({ path, size, name, lastModified }) => ({
            path,
            size,
            name,
            lastModified,
        }));
        const distinctFileCount = await context.uploadFiles(files);
    };

    const handleDialogOpen = async () => {
        const distinctFileCount = await context.openFileDialog();
    };

    return (
        <Box pt="md">
            <BookDropzone
                fullscreen={hasBooks}
                onDrop={handleDrop}
                onFileDialogOpen={handleDialogOpen}
            ></BookDropzone>

            <SimpleGrid
                spacing={{
                    base: "calc(var(--mantine-spacing-xl) * 1.5)",
                    xs: "calc(var(--mantine-spacing-xl) * 1.5)",
                    sm: "xl",
                    md: "calc(var(--mantine-spacing-xl) * 1.5)",
                    lg: "calc(var(--mantine-spacing-xl) * 1.5)",
                    xl: "calc(var(--mantine-spacing-xl) * 1.5)",
                }}
                verticalSpacing="xl"
                cols={{ base: 2, xs: 2, sm: 3, md: 3, lg: 4, xl: 4 }}
                style={{ justifyItems: "center" }}
            >
                {filteredBookEntries.map(([filename, { metadata, state }]) => (
                    <BookCard filename={filename} metadata={metadata} skeleton={!state.isLoaded} />
                ))}
            </SimpleGrid>
        </Box>
    );
};
