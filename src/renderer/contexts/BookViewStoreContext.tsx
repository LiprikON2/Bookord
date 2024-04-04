import React, { createContext, useState } from "react";

import { CollectionKey, ViewItem } from "../stores/BookViewStore/interfaces";
import { BookMetadata } from "../stores/BookStore";
import { useUpdateBookViewStore } from "../stores/BookViewStore/hooks";

type MainOrUserCollectionKey = CollectionKey | undefined;

type BookViewStoreContextType = {
    activeCollectionKey: MainOrUserCollectionKey;
    setActiveCollectionKey: (collectionKey: MainOrUserCollectionKey) => void;
};

export const BookViewStoreContext = createContext<BookViewStoreContextType>({
    activeCollectionKey: undefined,
    setActiveCollectionKey: () => {},
});

// ref: https://stackoverflow.com/a/65440349/10744339
export const BookViewStoreContextProvider = ({
    metaBookRecords,
    children,
}: {
    metaBookRecords: ViewItem<BookMetadata>[];
    children?: React.ReactNode;
}) => {
    const [activeCollectionKey, setActiveCollectionKey] = useState<MainOrUserCollectionKey>();

    useUpdateBookViewStore(metaBookRecords);

    return (
        <BookViewStoreContext.Provider
            value={{ activeCollectionKey, setActiveCollectionKey }}
            children={children}
        />
    );
};
