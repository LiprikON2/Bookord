import React, { useState } from "react";
import { Dropzone, DropzoneProps, type FileRejection, type FileWithPath } from "@mantine/dropzone";
import { BookDropzoneStates } from "./components";

// export declare const EBOOK_MIME_TYPE: ("application/epub+zip" | "application/fb2" | "application/xhtml+xml" | "application/xml" | "application/x-mobipocket-ebook" | "application/vnd.amazon.ebook" | "application/pdf")[]
// export declare const EBOOK_MIME_TYPE: ("application/epub+zip" | "application/fb2" | "application/x-mobipocket-ebook" | "application/vnd.amazon.ebook")[]
// export declare const EBOOK_MIME_TYPE: ("application/epub+zip" | "application/fb2")[];

interface BookDropzoneProps extends Partial<DropzoneProps> {
    fullscreen?: boolean;
}

export const BookDropzone = ({
    fullscreen = false,
    onDrop,
    onReject,
    children,
    accept,
    ...rest
}: BookDropzoneProps) => {
    const dropzoneProps = {
        onDrop: (files: FileWithPath[]) => console.log("accepted files", files),
        onReject: (files: FileRejection[]) => console.log("rejected files", files),
        accept: ["application/epub+zip"],
    };

    if (!fullscreen) {
        return <Dropzone children={<BookDropzoneStates />} {...dropzoneProps} {...rest} />;
    } else {
        return (
            <Dropzone.FullScreen
                children={<BookDropzoneStates fullscreen />}
                {...dropzoneProps}
                {...rest}
            />
        );
    }
};
