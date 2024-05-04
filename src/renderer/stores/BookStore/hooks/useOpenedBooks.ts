import { useContext, useEffect, useState } from "react";
import { reaction } from "mobx";
import { RootStoreContext } from "../../RootStoreContext";

export const useOpenedBooks = () => {
    const { bookStore } = useContext(RootStoreContext);

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
