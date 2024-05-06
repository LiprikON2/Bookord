import { useCallback, useState } from "react";

export const useCallbackRef = <T extends HTMLElement>(callback?: (node: T) => void) => {
    const refCallback = useCallback((node: T) => {
        if (node !== null) callback?.(node);
    }, []);

    return refCallback;
};
