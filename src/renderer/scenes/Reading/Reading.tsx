import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";

import { bookKeyRoute } from "~/renderer/appRenderer";
import { ttStore } from "~/renderer/store";
import { toJS } from "mobx";

export const Reading = observer(() => {
    const { bookKey } = bookKeyRoute.useParams();

    useEffect(() => {
        ttStore.openBook(bookKey);
    }, []);
    const state = ttStore.getBookState(bookKey);
    const metadata = ttStore.getBookMetadata(bookKey);
    const content = ttStore.getBookContent(bookKey);
    const contentState = ttStore.getBookContentState(bookKey);

    // console.log("state", state);
    // console.log("metadata", metadata);
    // console.log("contentState", toJS(contentState));
    // console.log("content", content);

    return (
        <>
            <h1>hello {typeof metadata?.title === "string" ? metadata?.title : bookKey}</h1>
            <h1>{contentState?.isInitSectionParsed ? "CONTENT" : "<Blank>"}</h1>
        </>
    );
});
