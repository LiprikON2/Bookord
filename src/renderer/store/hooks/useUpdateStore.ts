import { useEffect } from "react";

import context from "../ipc";
import { BookKey, bookStore } from "..";

// TODO move this logic inside store
export const useUpdateStore = () => {
    /* Requests initial watcher update */
    useEffect(() => {
        context.watcherSendUpdate();
    }, []);
    /* Handles updating store when watcher updates are received  */
    useEffect(() => {
        // TODO move in a separate context file; add types
        const unsub = window.electron_window.events("watcher-update", (({
            bookKeys,
        }: {
            bookKeys: BookKey[];
        }) => bookStore.updateStore(bookKeys)) as any);

        return () => unsub();
    }, []);
};
