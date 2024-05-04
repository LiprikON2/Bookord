import { useContext, useEffect, useState } from "react";
import { reaction } from "mobx";

import { BookKey } from "../BookStore";
import sampleCover from "~/assets/images/sampleBookCover.webp";
import { RootStoreContext } from "../../RootStoreContext";

const provideFallbackCover = (cover?: string): string => {
    if (!cover || cover === "unkown") return sampleCover;
    return cover;
};

const provideFallbackTitle = (filename: string, title?: any): string => {
    if (typeof title === "object" && "_" in title) return title?._ ?? filename;
    if (typeof title === "string" && title) return title;
    return filename;
};

const provideFallbackAuthors = (authors?: any): string => {
    if (typeof authors === "object") {
        if ("_" in authors && typeof authors?._ === "string") {
            return authors._;
        } else return "Unknown";
    } else if (typeof authors === "string" && authors) return authors;
    return authors;
};

export const useBookMetadata = (bookKey: BookKey) => {
    const { bookStore } = useContext(RootStoreContext);

    const [metadata, setMetadata] = useState(() => bookStore.getBookMetadata(bookKey));

    useEffect(() => {
        const unsub1 = reaction(
            () => bookStore.getBookMetadata(bookKey),
            (metadata) => setMetadata(metadata),
            { fireImmediately: true }
        );

        return () => {
            unsub1();
        };
    }, [bookKey]);

    return {
        ...metadata,

        cover: provideFallbackCover(metadata?.cover),
        title: provideFallbackTitle(bookKey, metadata?.title),
        authors: provideFallbackAuthors(metadata?.author),
    };
};
