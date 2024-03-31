import { useEffect } from "react";

// TODO move this context function closer
import context from "../ipc";
import { BookKey, ttStore } from "../store";

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
        }) => ttStore.updateStore(bookKeys)) as any);

        return () => unsub();
    }, []);
};
