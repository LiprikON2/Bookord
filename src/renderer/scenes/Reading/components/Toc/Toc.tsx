import React, { useMemo, useState } from "react";

import { useBookContent, type BookKey } from "~/renderer/stores";
import { useTocNav } from "./hooks";
import { TocChild } from "./components";
import { observer } from "mobx-react-lite";

interface TocProps {
    autoscrollTargetRef: (node: any) => void;
    bookKey: BookKey;
}

// TODO don't autoscroll on user clicks
// TODO autounfold when chapter (that is inside folded heading chapter) becomes active (e.g. Warlock.epub)
export const Toc = observer(({ autoscrollTargetRef, bookKey }: TocProps) => {
    const { content } = useBookContent(bookKey);
    const tocChildren = content?.structure;

    const { tocProps } = useTocNav(tocChildren);

    return tocProps.map((tocProp) => (
        <TocChild key={tocProp.key} {...tocProp} autoscrollTargetRef={autoscrollTargetRef} />
    ));
});
