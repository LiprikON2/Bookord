import React from "react";
import { Dropzone, DropzoneProps, type FileRejection } from "@mantine/dropzone";
import { observer } from "mobx-react-lite";

import { BookDropzoneStates } from "./components";

interface BookDropzoneProps extends Partial<DropzoneProps> {
    fullscreen?: boolean;
}

export const BookDropzone = observer(
    ({
        fullscreen = false,
        activateOnClick,
        onFileDialogOpen,
        onDrop,
        onReject,
        children,
        accept,
        ...rest
    }: BookDropzoneProps) => {
        const dropzoneProps = {
            // onDrop: (files: FileWithPath[]) => console.log("accepted files", files),
            onDrop,
            onReject: (files: FileRejection[]) => console.log("rejected files", files),
            accept: ["application/epub+zip"],
        };

        if (!fullscreen) {
            return (
                <Dropzone
                    data-activate-on-click
                    activateOnClick={false}
                    onClick={onFileDialogOpen}
                    {...dropzoneProps}
                    {...rest}
                >
                    <BookDropzoneStates />
                </Dropzone>
            );
        } else {
            return (
                <Dropzone.FullScreen {...dropzoneProps} {...rest}>
                    <BookDropzoneStates fullscreen />
                </Dropzone.FullScreen>
            );
        }
    }
);
