import React from "react";

import { useBookContent, type BookKey } from "~/renderer/stores";
import { useTocNav } from "./hooks";
import { TocChild } from "./components";

interface TocProps {
    autoscrollTargetRef: (node: any) => void;
    bookKey: BookKey;
}

// TODO don't autoscroll on user clicks
export const Toc = ({ autoscrollTargetRef, bookKey }: TocProps) => {
    const { content } = useBookContent(bookKey);
    const tocChildren = content?.structure;

    const { tocNavTo } = useTocNav();

    return tocChildren.map((tocChild, index) => (
        <TocChild
            autoscrollTargetRef={autoscrollTargetRef}
            isFirst={index === 0}
            key={`${tocChild.sectionId}-${index}`}
            toc={tocChild}
            onClick={() => {
                if (!tocChild?.children?.length) tocNavTo(tocChild.sectionId);
            }}
        />
    ));
};
