import React, { createContext, useState } from "react";

type BookComponentContextType = {
    contextRef: any;
    setContextRef: (ref: any) => void;
    contextUiState: UiState;
    setContextUiState: (state: UiState) => void;
};

export const BookComponentContext = createContext<BookComponentContextType>({
    contextRef: null,
    setContextRef: () => {},
    contextUiState: {
        currentSectionTitle: "",
        currentSectionPage: 0,
        totalSectionPages: 0,
        currentBookPage: 0,
        totalBookPages: 0,
    },
    setContextUiState: () => {},
});

// ref: https://stackoverflow.com/a/65440349/10744339
export const BookComponentContextProvider = ({ children }: { children?: React.ReactNode }) => {
    const [contextRef, setContextRef] = useState<any>();
    const [contextUiState, setContextUiState] = useState<any>();

    return (
        <BookComponentContext.Provider
            value={{ contextRef, setContextRef, contextUiState, setContextUiState }}
            children={children}
        />
    );
};
