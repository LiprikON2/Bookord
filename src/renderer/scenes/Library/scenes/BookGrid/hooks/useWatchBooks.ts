import { useEffect, useState } from "react";
import context from "../ipc";
import { useSetState } from "@mantine/hooks";
import _ from "lodash";

const baseMetadata = {
    title: "",
    indentifiers: "",
    languages: "",
    relations: "",
    subjects: "",
    publishers: "",
    contributors: "",
    coverages: "",
    rights: "",
    sources: "",
    description: "",
    date: "",
    cover: "",
    author: "",
};

export type Metadata = typeof baseMetadata;

/* TODO make it so this hook can be used multiple times without creating multiple event listeners */
export const useWatchBooks = () => {
    const [books, setBooks] = useSetState<{
        [key: string]: { metadata: Metadata; state: { isLoaded: boolean } };
    }>({});

    useEffect(() => {
        context.watcherSendUpdate();
    }, []);

    useEffect(() => {
        /* https://react.dev/learn/synchronizing-with-effects#fetching-data */
        const updateBooks = async ({
            list,
            update,
        }: {
            list: string[];
            update: { action: "add" | "delete" | "get-list" };
        }) => {
            const currentBooks = Object.keys(books);
            const addedBooks = _.difference(list, currentBooks);
            const deletedBooks = _.difference(currentBooks, list);

            if (addedBooks.length) {
                addedBooks.forEach((addedBook) =>
                    setBooks({
                        [addedBook]: { metadata: baseMetadata, state: { isLoaded: false } },
                    })
                );
                const metadataEntries: [string, Metadata][] = await context.getMetadata(addedBooks);

                metadataEntries.forEach(([addedBook, metadata]) =>
                    setBooks({ [addedBook]: { metadata, state: { isLoaded: true } } })
                );
            }
            if (deletedBooks.length) {
                deletedBooks.forEach((deletedBook) => setBooks({ [deletedBook]: undefined }));
            }
        };

        // TODO move in a separate context file; add types
        const unsub = window.electron_window.events("watcher-update", updateBooks as any);
        return () => {
            unsub();
        };
    }, [Object.keys(books)]);

    const bookEntries = Object.entries(books).filter(
        ([fileName, metadata]) => metadata !== undefined
    );
    const hasBooks = !!bookEntries.length;

    return [bookEntries, hasBooks] as [typeof bookEntries, typeof hasBooks];
};
