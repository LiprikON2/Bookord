import { useEffect, useState } from "react";
import { reaction } from "mobx";
import _ from "lodash";

import { type OpenedBooks, openedBooksStore, openBook } from "../store";

export const useOpenedBooks = (bookKey?: string) => {
    const [openedBooksValue, setOpenedBooksValue] = useState<OpenedBooks>(
        () => openedBooksStore.books
    );
    useEffect(() => {
        const unsub1 = reaction(
            () => openedBooksStore.books,
            (openedBooks) => setOpenedBooksValue(openedBooks)
        );

        return () => {
            unsub1();
        };
    }, []);

    useEffect(() => {
        openBook(bookKey);
    }, [bookKey]);

    const openedBookKeys = Object.keys(openedBooksValue);

    const openedBook = "";

    return {
        openedBookKeys,
        openedBook,
    };
};
