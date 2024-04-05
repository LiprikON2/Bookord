import { useEffect, useState } from "react";
import { reaction } from "mobx";

import { bookStore } from "../store";

export const useOpenedBooks = () => {
    const [openedBooks, setOpenedBooks] = useState(() => bookStore.getBookStateOpened());

    useEffect(() => {
        const unsub1 = reaction(
            () => bookStore.getBookStateOpened(),
            (openedBooks) => setOpenedBooks(openedBooks)
            // { fireImmediately: true }
        );

        return () => {
            unsub1();
        };
    }, []);

    return openedBooks;
};
