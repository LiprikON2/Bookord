import { useEffect, useState } from "react";
import { reaction } from "mobx";

import { ttStore } from "../store";

export const useTt = () => {
    const [bookStateRecords, setBookStateRecords] = useState(() => ttStore.getBookStateAll());
    const [bookKeysInStorage, setBookKeysInStorage] = useState(() =>
        ttStore.getBookKeysInStorage()
    );

    /* Syncs mobx store to react state without the need for observable in components */
    useEffect(() => {
        const unsub1 = reaction(
            () => ttStore.getBookStateAll(),
            (bookStateRecords) => setBookStateRecords(bookStateRecords)
        );
        const unsub2 = reaction(
            () => ttStore.getBookKeysInStorage(),
            (bookKeysInStorage) => setBookKeysInStorage(bookKeysInStorage)
        );

        return () => {
            unsub1();
            unsub2();
        };
    }, []);

    const isBookStorageEmpty = !bookKeysInStorage.length;

    return { isBookStorageEmpty, bookStateRecords };
};
