import React from "react";
import { Box } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";
import { observer } from "mobx-react-lite";

import context from "~/renderer/ipc/fileOperations";
import { BookDropzone, BookGroups } from "./scenes";
import { BookMetadata, ViewItemGroup } from "~/renderer/stores";

interface BookGridProps {
    bookGroups: ViewItemGroup<BookMetadata>[];
    isBookStorageEmpty: boolean;
}

export const BookGrid = observer(({ bookGroups, isBookStorageEmpty }: BookGridProps) => {
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
            />

            <BookGroups bookGroups={bookGroups} />
        </Box>
    );
});
