import { useEffect } from "react";
import _ from "lodash";

// TODO move this context function closer
import context from "../scenes/Library/scenes/BookGrid/ipc";
import { addBooks, getBooks, getSearchTerm, getTags, removeBooks, setSearchTerm } from "../store";

export const useBooks = () => {
    const books = getBooks();
    const tags = getTags();
    const searchTerm = getSearchTerm();

    useEffect(() => {
        context.watcherSendUpdate();
    }, []);

    useEffect(() => {
        /* https://react.dev/learn/synchronizing-with-effects#fetching-data */
        const updateBooks = async ({ list }: { list: string[] }) => {
            const currentBooks = Object.keys(books);
            const addedBooks = _.difference(list, currentBooks);
            const removedBooks = _.difference(currentBooks, list);

            if (addedBooks.length) addBooks(addedBooks);
            if (removedBooks.length) removeBooks(removedBooks);
        };

        // TODO move in a separate context file; add types
        const unsub = window.electron_window.events("watcher-update", updateBooks as any);
        return () => unsub();
    }, [Object.keys(books)]);

    const bookEntries = Object.entries(books);
    const booksCount = bookEntries.length;
    const hasBooks = !!booksCount;
    return { bookEntries, hasBooks, searchTerm, setSearchTerm, booksCount, tags };
};
