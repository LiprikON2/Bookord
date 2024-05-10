import React from "react";
import { Box } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { observer } from "mobx-react-lite";

import context from "~/renderer/ipc/fileOperations";
import { useBookStore, useBookViewStore } from "~/renderer/stores";
import { BookDropzone, BookGroups } from "./scenes";

export const BookGrid = observer(() => {
    const bookViewStore = useBookViewStore();
    const bookStore = useBookStore();

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
            {bookStore.isReady && (
                <BookDropzone
                    getIsFullscreen={() => !bookViewStore.isBookStorageEmpty}
                    onDrop={handleDrop}
                    onFileDialogOpen={openFileDialog}
                />
            )}

            <BookGroups
                getBookGroups={() => bookViewStore.bookGroups}
                visible={bookStore.isReady}
            />
        </Box>
    );
});
