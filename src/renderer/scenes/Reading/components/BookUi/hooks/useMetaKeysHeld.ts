import { useEffect, useState } from "react";

interface MetaKeys {
    altKey?: boolean;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
}

const getTrackedState = (e: KeyboardEvent, trackedKeys: MetaKeys) => {
    const trackedState: boolean[] = [];

    Object.entries(trackedKeys).forEach(
        ([key, tracked]: [keyof MetaKeys, boolean]) => tracked && trackedState.push(e[key])
    );

    return trackedState;
};
export const useMetaKeysHeld = (trackedKeys: MetaKeys, logicOp: "or" | "and" = "and") => {
    const [keysHeld, setKeysHeld] = useState(false);

    const downHandler = (e: KeyboardEvent) => {
        const trackedState = getTrackedState(e, trackedKeys);

        if (logicOp === "or") {
            const areSomeHeld = trackedState.some((key) => key);
            if (areSomeHeld) setKeysHeld(true);
        }
        if (logicOp === "and") {
            const areAllHeld = trackedState.every((key) => key);
            if (areAllHeld) setKeysHeld(true);
        }
    };

    const upHandler = (e: KeyboardEvent) => {
        const trackedState = getTrackedState(e, trackedKeys);

        if (logicOp === "or") {
            const areSomeLetGo = !trackedState.some((key) => key);
            if (areSomeLetGo) setKeysHeld(false);
        }
        if (logicOp === "and") {
            const areAllLetGo = !trackedState.every((key) => key);
            if (areAllLetGo) setKeysHeld(false);
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    }, []);

    return keysHeld;
};
