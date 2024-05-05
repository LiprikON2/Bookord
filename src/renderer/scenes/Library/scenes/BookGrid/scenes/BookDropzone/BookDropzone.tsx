import React from "react";
import { Dropzone, DropzoneProps, type FileRejection } from "@mantine/dropzone";
import { observer } from "mobx-react-lite";

import { BookDropzoneStates } from "./components";

interface BookDropzoneProps extends Partial<DropzoneProps> {
    getIsFullscreen?: () => boolean;
}

export const BookDropzone = observer(
    ({
        getIsFullscreen = () => false,
        activateOnClick,
        onFileDialogOpen,
        onDrop,
        onReject,
        children,
        accept,
        ...rest
    }: BookDropzoneProps) => {
        const dropzoneProps = {
            onDrop,
            onReject: (files: FileRejection[]) => console.log("rejected files", files),
            accept: ["application/epub+zip"],
        };

        if (getIsFullscreen()) {
            return (
                <Dropzone.FullScreen {...dropzoneProps} {...rest}>
                    <BookDropzoneStates fullscreen />
                </Dropzone.FullScreen>
            );
        } else {
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
        }
    }
);
