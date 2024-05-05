import { useEffect } from "react";

import context from "~/renderer/ipc/fileOperations";
import { BookStore } from "..";

export const useUpdateBookStore = (bookStore: BookStore) => {
    /* Requests initial watcher update */
    useEffect(() => {
        context.requestWatcherUpdate();
    }, [bookStore]);

    /* Updates store when watcher updates are received  */
    useEffect(() => {
        const unsub = context.handleWatcherUpdate(({ bookKeys }) =>
            bookStore.updateBooks(bookKeys)
        );

        return () => unsub();
    }, [bookStore]);
};
