import { observer } from "mobx-react-lite";
import React, { createContext, useState } from "react";

type BookComponentContextType = {
    contextRef: any;
    setContextRef: (ref: any) => void;
    contextUiState: UiState;
    setContextUiState: (state: UiState) => void;
    ttsTarget: TtsTarget;
    setTtsTarget: (state: TtsTarget) => void;
    resetTtsTarget: () => void;
};

const defaultUiState = {
    currentSectionTitle: "",
    currentSectionPage: 0,
    totalSectionPages: 0,
    currentBookPage: 0,
    totalBookPages: 0,
};

type TtsTarget = {
    startElement: ParentNode | null;
    startElementSelectedText: string | null;
};

const defaultTtsTarget: TtsTarget = {
    startElement: null,
    startElementSelectedText: null,
};

export const BookComponentContext = createContext<BookComponentContextType>({
    contextRef: null,
    setContextRef: () => {},
    contextUiState: defaultUiState,
    setContextUiState: () => {},
    ttsTarget: defaultTtsTarget,
    setTtsTarget: () => {},
    resetTtsTarget: () => {},
});

// ref: https://stackoverflow.com/a/65440349/10744339
export const BookComponentContextProvider = observer(
    ({ children }: { children?: React.ReactNode }) => {
        const [contextRef, setContextRef] = useState<any>(null);
        const [contextUiState, setContextUiState] = useState<UiState>(defaultUiState);
        const [ttsTarget, setTtsTarget] = useState<TtsTarget>();

        const resetTtsTarget = () => setTtsTarget(defaultTtsTarget);

        return (
            <BookComponentContext.Provider
                value={{
                    contextRef,
                    setContextRef,
                    contextUiState,
                    setContextUiState,
                    ttsTarget,
                    setTtsTarget,
                    resetTtsTarget,
                }}
            >
                {children}
            </BookComponentContext.Provider>
        );
    }
);
