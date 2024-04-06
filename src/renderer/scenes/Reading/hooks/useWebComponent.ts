import { useMergedRef } from "@mantine/hooks";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";

type EventListener<K> = {
    type: keyof K;
    listener: (this: HTMLDivElement, ev: K[keyof K] & { [key: string]: any }) => any;
    options?: boolean | AddEventListenerOptions;
};

export const useWebComponent = <K, T extends HTMLElement = any>(
    events: EventListener<K>[],
    onMount: (webComponent: T) => void = () => {}
) => {
    const ref = useRef<T>(null);
    const webComponentRef = useMergedRef<T>(ref) as unknown as MutableRefObject<T>;

    const setWebComponentRef = useCallback((webComponent: T) => {
        if (webComponent) onMount(webComponent);
        webComponentRef.current = webComponent;
    }, []);

    useEffect(() => {
        if (webComponentRef.current) {
            events.forEach(({ type, listener, options }) =>
                webComponentRef.current.addEventListener(type as any, listener as any, options)
            );

            return () =>
                events.forEach(({ type, listener, options }) =>
                    webComponentRef.current?.removeEventListener(
                        type as any,
                        listener as any,
                        options
                    )
                );
        }
        return undefined;
    }, [events]);

    const refReadyDecorator = (callback: (bookComponent: HTMLElement) => void) => {
        const bookComponent = webComponentRef.current;
        if (bookComponent) callback(bookComponent);
    };

    return [webComponentRef, setWebComponentRef, refReadyDecorator] as [
        typeof webComponentRef,
        typeof setWebComponentRef,
        typeof refReadyDecorator
    ];
};
