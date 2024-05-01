import React, { createContext, useState } from "react";
import { TocState } from "../scenes/Reading/components/BookWebComponent";

type BookComponentContextTocType = {
    tocState: TocState;
    setTocState: (state: TocState) => void;
};

const defaultTocState: TocState = {
    currentSectionName: null,
    currentSection: null,
    currentSectionTitle: null,
    sectionNames: null,
};

export const BookComponentTocContext = createContext<BookComponentContextTocType>({
    tocState: defaultTocState,
    setTocState: () => {},
});

// ref: https://stackoverflow.com/a/65440349/10744339
export const BookComponentTocContextProvider = ({ children }: { children?: React.ReactNode }) => {
    const [tocState, setTocState] = useState<TocState>(defaultTocState);

    return (
        <BookComponentTocContext.Provider
            value={{
                tocState,
                setTocState,
            }}
            children={children}
        />
    );
};
