import React from "react";

import { useBookContent, type BookKey } from "~/renderer/stores";
import { useTocNav } from "./hooks";
import { TocChild } from "./components";

interface TocProps {
    bookKey: BookKey;
}

// TODO consider https://ui.mantine.dev/category/toc/
export const Toc = ({ bookKey }: TocProps) => {
    const { content } = useBookContent(bookKey);
    const tocChildren = content?.structure;

    const { handleTocNav } = useTocNav();

    return tocChildren.map((tocChild, index) => (
        <TocChild
            isFirst={index === 0}
            key={`${tocChild.sectionId}-${index}`}
            toc={tocChild}
            onClick={() => {
                if (!tocChild?.children?.length) handleTocNav(tocChild.sectionId);
            }}
        />
    ));
};
