import React, { useMemo, useState } from "react";

import { useBookContent, type BookKey, bookStore } from "~/renderer/stores";
import { useTocNav } from "./hooks";
import { TocChild } from "./components";

interface TocProps {
    autoscrollTargetRef: (node: any) => void;
    bookKey: BookKey;
}

// TODO don't autoscroll on user clicks
// TODO autounfold when chapter (that is inside folded heading chapter) becomes active (e.g. Warlock.epub)
export const Toc = ({ autoscrollTargetRef, bookKey }: TocProps) => {
    const { content } = useBookContent(bookKey);
    const tocChildren = content?.structure;

    const { tocProps } = useTocNav(tocChildren);

    return tocProps.map((tocProp) => (
        <TocChild {...tocProp} autoscrollTargetRef={autoscrollTargetRef} />
    ));
};
