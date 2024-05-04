import { useContext, useEffect, useState } from "react";
import { reaction } from "mobx";

import { BookKey, Bookmark } from "../BookStore";
import { RootStoreContext } from "../../RootStoreContext";

export const useBookInteractions = (bookKey: BookKey) => {
    const { bookStore } = useContext(RootStoreContext);

    const [autobookmarkState, setAutobookmarkState] = useState(
        () => bookStore.getBookInteraction(bookKey).bookmarks.auto
    );

    useEffect(() => {
        const unsub1 = reaction(
            () => bookStore.getBookInteraction(bookKey).bookmarks.auto,
            (autobookmarkState) => setAutobookmarkState(autobookmarkState)
        );

        return () => {
            unsub1();
        };
    }, [bookKey]);

    const setAutobookmark = (bookmark: Bookmark) => {
        bookStore.addBookInteractionBookmark(bookKey, bookmark, "auto");
    };
    const addManualBookmark = (bookmark: Bookmark) => {
        bookStore.addBookInteractionBookmark(bookKey, bookmark, "manual");
    };
    const removeManualBookmark = (bookmark: Bookmark) => {
        bookStore.removeBookInteractionBookmark(bookKey, bookmark);
    };

    return {
        autobookmark: autobookmarkState,
        addManualBookmark,
        setAutobookmark,
        removeManualBookmark,
    };
};
