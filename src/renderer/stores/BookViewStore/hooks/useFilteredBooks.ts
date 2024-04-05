import { useContext, useEffect, useLayoutEffect, useState } from "react";

import { BookViewStoreContext } from "~/renderer/contexts";
import { ViewItem } from "../interfaces";
import { BookMetadata } from "../../books";
import { bookViewStore } from "../store";
import { reaction } from "mobx";
import { useStorageBooks } from "../../BookStore";

export const useFilteredBooks = () => {
    const { activeCollectionKey } = useContext(BookViewStoreContext);

    const { metaBookRecords, isBookStorageEmpty } = useStorageBooks();

    const [bookGroups, setBookGroups] = useState(() =>
        bookViewStore.apply(metaBookRecords, activeCollectionKey)
    );

    // Layout effect is used to prevent the deleted books from flashing as skeletons
    useLayoutEffect(() => {
        const unsub1 = reaction(
            () => bookViewStore.apply(metaBookRecords, activeCollectionKey),
            (bookGroups) => setBookGroups(bookGroups),
            { fireImmediately: true }
        );

        return () => {
            unsub1();
        };
    }, [metaBookRecords]);

    return { bookGroups, isBookStorageEmpty };
};
