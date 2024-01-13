import React from "react";
import { Box, SimpleGrid } from "@mantine/core";
import type { FileWithPath } from "@mantine/dropzone";

import { BookDropzone } from "./scenes";
import { BookCard } from "./components";
import context from "./ipc";

export const BookGrid = () => {
    const handleDrop = (fileBlobs: FileWithPath[]) => {
        const files = fileBlobs.map(({ path, size, name, lastModified }) => ({
            path,
            size,
            name,
            lastModified,
        }));
        context.uploadFiles(files);

        console.log("files", files);
        // const mappedFiles = files.map((file) => {
        //     return {
        //         name: file.name,
        //         path: file.path,
        //     };
        // });
        // // send file(s) add event to the `main` process
        // const promise = window.api.invoke("app:on-file-add", mappedFiles);
        // promise.then((fileCount) => {
        //     setSkeletontFileCount(fileCount);
        //     updateFiles();
        // });
    };

    const books = [1, 2, 3, 4, 5, 6, 7];
    const hasBooks = !!books.length;

    return (
        <Box pt="md">
            <BookDropzone fullscreen={hasBooks} onDrop={handleDrop}></BookDropzone>

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
                {books.map((book) => (
                    <BookCard key={book} />
                ))}
            </SimpleGrid>
        </Box>
    );
};
