import { useEffect, useState } from "react";
import _ from "lodash";

// TODO move this context function closer
import context from "../scenes/Library/scenes/BookGrid/ipc";
import {
    type Books,
    booksStore,
    filteredBooksCompute,
    addBooks,
    removeBooks,
    // getTags,
    setSearchTerm,
    tagsCompute,
    setTag,
} from "../store";
import { reaction, toJS } from "mobx";

export const useBooks = () => {
    // const tags = getTags();

    // https://github.com/mobxjs/mobx/discussions/3737#discussioncomment-6548377
    const [booksValue, setBooksValue] = useState<Books>(() => booksStore.books);
    const [filteredBooksValue, setFilteredBooksValue] = useState<Books>(filteredBooksCompute.get());
    const [searchTermValue, setSearchTermValue] = useState<string>(() => booksStore.searchTerm);
    const [tagsValue, setTagsValue] = useState(() => tagsCompute.get());
    // TODO filteredTagsValue

    useEffect(() => {
        const unsub1 = reaction(
            () => booksStore.books,
            (books) => setBooksValue(books)
        );
        const unsub2 = reaction(
            () => booksStore.searchTerm,
            (searchTerm) => setSearchTermValue(searchTerm)
        );
        const unsub3 = reaction(
            () => filteredBooksCompute.get(),
            (filteredBooks) => setFilteredBooksValue(filteredBooks)
        );
        const unsub4 = reaction(
            () => tagsCompute.get(),
            (tags) => setTagsValue(tags)
        );

        return () => {
            unsub1();
            unsub2();
            unsub3();
            unsub4();
        };
    }, []);

    useEffect(() => {
        context.watcherSendUpdate();
    }, []);

    useEffect(() => {
        /* https://react.dev/learn/synchronizing-with-effects#fetching-data */
        const updateBooks = async ({ list }: { list: string[] }) => {
            const currentBooks = Object.keys(booksValue);
            const addedBooks = _.difference(list, currentBooks);
            const removedBooks = _.difference(currentBooks, list);

            if (addedBooks.length) addBooks(addedBooks);
            if (removedBooks.length) removeBooks(removedBooks);
        };

        // TODO move in a separate context file; add types
        const unsub = window.electron_window.events("watcher-update", updateBooks as any);
        return () => unsub();
    }, [Object.keys(booksValue)]);

    const bookEntries = Object.entries(booksValue);
    const bookCount = bookEntries.length;
    const hasBooks = !!bookCount;

    const filteredBookEntries = Object.entries(filteredBooksValue);
    const filteredBookCount = filteredBookEntries.length;
    const hasFilteredBooks = !!filteredBookCount;

    return {
        bookEntries,
        hasBooks,
        bookCount,

        filteredBookEntries,
        hasFilteredBooks,
        filteredBookCount,

        searchTerm: searchTermValue,
        setSearchTerm,
        tags: tagsValue,

        setTag,
    };
};
