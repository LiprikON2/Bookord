import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import { bookKeyRoute } from "~/renderer/appRenderer";
import { bookStore, useBookContent, useBookMetadata } from "~/renderer/stores";
import { toJS } from "mobx";

export const Reading = observer(() => {
    const { bookKey } = bookKeyRoute.useParams();

    useEffect(() => {
        bookStore.openBook(bookKey);
    }, []);
    // const state = bookStore.getBookState(bookKey);
    // // const metadata = bookStore.getBookMetadata(bookKey);
    // const content = bookStore.getBookContent(bookKey);
    // const contentState = bookStore.getBookContentState(bookKey);

    const metadata = useBookMetadata(bookKey);
    const { content, contentState } = useBookContent(bookKey);

    // console.log("state", state);
    // console.log("metadata", metadata);
    console.log("contentState", contentState.parsedSections.length);
    console.log("content", content);

    return (
        <>
            <h1>hello {typeof metadata?.title === "string" ? metadata?.title : bookKey}</h1>
            <h1>{contentState?.isInitSectionParsed ? "CONTENT" : "<Blank>"}</h1>
        </>
    );
});
