import { useCallback } from "react";
import { useMergedRef, useScrollIntoView } from "@mantine/hooks";

export const useAutoscrollIntoView = (params: Parameters<typeof useScrollIntoView>[0]) => {
    const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<HTMLDivElement>(params);

    // ref: https://legacy.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
    const autoscrollRef = useCallback((node: HTMLDivElement) => {
        if (node !== null) scrollIntoView();
    }, []);

    const autoscrollTargetRef = useMergedRef(targetRef, autoscrollRef);

    return { scrollableRef, autoscrollTargetRef };
};
