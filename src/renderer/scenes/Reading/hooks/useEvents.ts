import { useEffect, useRef } from "react";

export type EventMap<K> = {
    [U in keyof K]?: (event: K[U]) => void;
};
// works but object

// ref (code): https://mantine.dev/hooks/use-event-listener/
export const useEvents = <K extends HTMLElementEventMap, T extends HTMLElement = any>(
    events: EventMap<K>
) => {
    const ref = useRef<T>();

    useEffect(() => {
        if (ref.current) {
            Object.entries(events).forEach(([type, listener]: [string, any]) =>
                ref.current.addEventListener(type, listener)
            );

            return () => {
                Object.entries(events).forEach(([type, listener]: [string, any]) =>
                    ref.current?.removeEventListener(type, listener)
                );
            };
        }
        return undefined;
    }, [events]);

    return ref;
};

// useEvents([["click", (ss) => console.log("click")]]);
// works but need to generic arguments or none
// export const useEvents = <T extends HTMLElementEventMap, K extends keyof T>(
//     events: Array<[K, (event: T[K]) => void]>
// ) => {};

// results in union type
// export const useEvents = <T extends HTMLElementEventMap>(
//     events: Array<[keyof T, (event: T[keyof T]) => void]>
// ) => {};

// results in union type
// export const useEvents = <T extends HTMLElementEventMap, K extends keyof T = keyof T>(
//     events: Array<[K, (event: T[K]) => void]>
// ) => {};
