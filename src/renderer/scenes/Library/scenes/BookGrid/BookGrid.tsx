import React from "react";
import { Dropzone } from "@mantine/dropzone";
import { BookDropzone } from "./scenes";
import { Box } from "@mantine/core";

export const BookGrid = () => {
    const handleDrop = (files: object[]) => {
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

    const hasBooks = true;

    return (
        <Box pt="md">
            <BookDropzone fullscreen={hasBooks} onDrop={handleDrop}></BookDropzone>
            {/* <div className="library-container" id="uploader">
                <Stack spacing="xs" align="stretch" className="card-group-list">
                    {hasBooks ? (
                        <LibraryListGroups
                            files={files}
                            grouping={grouping}
                            groupingOrder={groupingOrder}
                            skeletontFileCount={skeletontFileCount}
                        />
                    ) : (
                        <Dropzone
                            className="limit-width"
                            onClick={handleUpload}
                            onDrop={handleDrop}
                        ></Dropzone>
                    )}
                </Stack>
            </div> */}
        </Box>
    );
};
