import React, { useEffect } from "react";

import { bookKeyRoute } from "~/renderer/appRenderer";
import { bookStore, useBookContent, useBookMetadata } from "~/renderer/stores";

export const Reading = () => {
    const { bookKey } = bookKeyRoute.useParams();

    useEffect(() => {
        bookStore.openBook(bookKey);
    }, []);

    const metadata = useBookMetadata(bookKey);
    const { content, contentState } = useBookContent(bookKey);

    // console.log("contentState", contentState.parsedSections.length);
    // console.log("content", content);

    return (
        <>
            <h1>hello {typeof metadata?.title === "string" ? metadata?.title : bookKey}</h1>
            <h1>{contentState?.isInitSectionParsed ? "CONTENT" : "<Blank>"}</h1>
        </>
    );
};
