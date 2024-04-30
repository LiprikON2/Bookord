import { useEffect } from "react";

import context from "~/renderer/ipc/fileOperations";
import { bookStore } from "..";

export const useUpdateBookStore = () => {
    /* Requests initial watcher update */
    useEffect(() => {
        context.requestWatcherUpdate();
    }, []);
    /* Updates store when watcher updates are received  */
    useEffect(() => {
        const unsub = context.handleWatcherUpdate(({ bookKeys }) =>
            bookStore.updateStore(bookKeys)
        );

        return () => unsub();
    }, []);
};
