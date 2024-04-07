import React from "react";
import { NavLink } from "@mantine/core";

import { type BookKey, Structure } from "~/renderer/stores";
import { useTocNav } from "../hooks";

export const TocChild = ({
    recDepth = 0,
    isFirst = false,
    toc,
    onClick,
}: {
    recDepth?: number;
    isFirst?: boolean;
    toc?: Structure;
    onClick?: () => void;
}) => {
    const { handleTocNav, currentSectionTitle } = useTocNav();

    const isOutermost = recDepth === 0;

    const isActive =
        toc.name === currentSectionTitle || (isFirst && isOutermost && !currentSectionTitle);

    return (
        <NavLink
            label={toc.name}
            active={isActive}
            onClick={onClick}
            childrenOffset={16}
            defaultOpened={isOutermost}
        >
            {toc?.children?.length &&
                toc.children.map((tocChild, index) => (
                    <TocChild
                        recDepth={recDepth + 1}
                        key={`${tocChild.sectionId}-${index}`}
                        toc={tocChild}
                        onClick={() => handleTocNav(tocChild.sectionId)}
                    />
                ))}
        </NavLink>
    );
};
