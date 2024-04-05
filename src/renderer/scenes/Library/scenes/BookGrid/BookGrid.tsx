import React, { useState } from "react";
import { Box, Modal, SimpleGrid } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";

import context from "~/renderer/ipc/fileOperations";
import { BookDropzone } from "./scenes";
import { BookCard } from "./components";
import { BookMetadata, ViewItemGroup, useFilteredBooks } from "~/renderer/stores";
import { AnimatePresence, motion } from "framer-motion";

export const BookGrid = ({
    bookGroups,
    isBookStorageEmpty,
}: {
    bookGroups: ViewItemGroup<BookMetadata>[];
    isBookStorageEmpty: boolean;
}) => {
    const [selectedBookKey, setSelectedBookKey] = useState<string>(null);

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
        <Box pt="md" style={{ position: "relative" }}>
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
                    <AnimatePresence initial={false}>
                        {bookGroup.items.map((book) => (
                            <BookCard
                                key={book.id}
                                bookKey={book.id}
                                visible={book.visible}
                                onClick={() => setSelectedBookKey(book.id)}
                            />
                        ))}
                    </AnimatePresence>
                </SimpleGrid>
            ))}

            {/* <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <AnimatePresence>
                    {selectedBookKey && (
                        <BookCard
                            bookKey={selectedBookKey}
                            onClick={() => setSelectedBookKey(null)}
                            scale={1.5}
                        />
                    )}
                </AnimatePresence>
            </div> */}
        </Box>
    );
};
