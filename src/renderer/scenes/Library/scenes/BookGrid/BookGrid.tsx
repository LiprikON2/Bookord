import React from "react";
import { Box, SimpleGrid } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";

import context from "~/renderer/ipc/fileOperations";
import { BookDropzone } from "./scenes";
import { BookCard } from "./components";
import { BookMetadata, ViewItemGroup, useFilteredBooks } from "~/renderer/stores";
import { AnimatePresence } from "framer-motion";

export const BookGrid = ({
    bookGroups,
    isBookStorageEmpty,
}: {
    bookGroups: ViewItemGroup<BookMetadata>[];
    isBookStorageEmpty: boolean;
}) => {
    const handleDrop = async (fileBlobs: FileWithPath[]) => {
        const files = fileBlobs.map(({ path, size, name, lastModified }) => ({
            path,
            size,
            name,
            lastModified,
        }));
        const distinctFileCount = await context.uploadFiles(files);
    };

    const openFileDialog = async () => {
        const distinctFileCount = await context.openFileDialog();
    };

    return (
        <Box pt="md">
            <BookDropzone
                fullscreen={!isBookStorageEmpty}
                onDrop={handleDrop}
                onFileDialogOpen={openFileDialog}
            ></BookDropzone>

            {bookGroups.map((bookGroup) => (
                <SimpleGrid
                    key={bookGroup.name}
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
                    <AnimatePresence initial={true}>
                        {bookGroup.items.map((book) => (
                            <BookCard key={book.id} bookKey={book.id} visible={book.visible} />
                        ))}
                    </AnimatePresence>
                </SimpleGrid>
            ))}
        </Box>
    );
};
