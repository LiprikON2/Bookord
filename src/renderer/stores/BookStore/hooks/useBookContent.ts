import { useEffect, useState } from "react";
import { reaction } from "mobx";

import { BookKey } from "../BookStore";
import { bookStore } from "../store";

export const useBookContent = (bookKey: BookKey, initSectionIndex = 0) => {
    const [content, setContent] = useState(() => bookStore.getBookContent(bookKey));
    const [contentState, setContentState] = useState(() => bookStore.getBookContentState(bookKey));

    useEffect(() => {
        const unsub1 = reaction(
            () => bookStore.getBookContentState(bookKey),
            (contentState) => {
                setContent(bookStore.getBookContent(bookKey));
                setContentState(contentState);
            },
            { fireImmediately: true }
        );

        return () => {
            unsub1();
        };
    }, [bookKey]);

    useEffect(() => bookStore.openBook(bookKey, initSectionIndex), []);

    return {
        content,
        contentState,
    };
};
