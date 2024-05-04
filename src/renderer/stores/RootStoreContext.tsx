import React, { createContext } from "react";
import { RootStore } from "./RootStore";
import { useUpdateBookStore } from "./BookStore";

export const RootStoreContext = createContext<RootStore | null>(null);

// ref: https://mobx-cookbook.github.io/react-integration/context-api
export const RootStoreContextProvider = ({ children }: { children?: React.ReactNode }) => {
    const rootStore = new RootStore();
    useUpdateBookStore(rootStore.bookStore);

    return <RootStoreContext.Provider value={rootStore} children={children} />;
};
