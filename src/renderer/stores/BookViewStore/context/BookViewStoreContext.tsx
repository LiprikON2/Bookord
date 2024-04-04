import React, { createContext, useState } from "react";
import { CollectionKey } from "../interfaces";

type MainOrUserCollectionKey = CollectionKey | undefined;

export const BookViewStoreContext =
    createContext<
        [MainOrUserCollectionKey, React.Dispatch<React.SetStateAction<MainOrUserCollectionKey>>]
    >(null);

export const BookViewStoreContextProvider = ({ children }: { children: React.ReactNode[] }) => {
    const value = useState<MainOrUserCollectionKey>();
    return <BookViewStoreContext.Provider value={value} children={children} />;
};
