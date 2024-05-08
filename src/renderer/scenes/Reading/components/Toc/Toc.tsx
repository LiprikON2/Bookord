import React from "react";
import { observer } from "mobx-react-lite";

import { useBookReadStore } from "~/renderer/stores";
import { SkeletonSidebar } from "~/renderer/components";
import { useTocNav } from "./hooks";
import { TocChild } from "./components";

interface TocProps {
    autoscrollTargetRef: (node: any) => void;
}

// TODO fix perfomance issues after mobx refactor
// TODO don't autoscroll on user clicks
export const Toc = observer(({ autoscrollTargetRef }: TocProps) => {
    const tocProps = useTocNav();

    const bookReadStore = useBookReadStore();

    if (!bookReadStore.isReady) {
        return <SkeletonSidebar />;
    }

    return tocProps.map((tocProp) => (
        <TocChild key={tocProp.key} {...tocProp} autoscrollTargetRef={autoscrollTargetRef} />
    ));
});
