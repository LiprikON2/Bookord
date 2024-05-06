import React from "react";
import { observer } from "mobx-react-lite";

import { useTocNav } from "./hooks";
import { TocChild } from "./components";

interface TocProps {
    autoscrollTargetRef: (node: any) => void;
}

// TODO fix perfomance issues after mobx refactor
// TODO don't autoscroll on user clicks
export const Toc = observer(({ autoscrollTargetRef }: TocProps) => {
    const tocProps = useTocNav();

    return tocProps.map((tocProp) => (
        <TocChild key={tocProp.key} {...tocProp} autoscrollTargetRef={autoscrollTargetRef} />
    ));
});
