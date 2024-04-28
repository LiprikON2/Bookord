import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "@mantine/core";

import { Structure } from "~/renderer/stores";
import { useTocNav } from "../hooks";
import classes from "./TocChild.module.css";
import { useMergedRef, useShallowEffect } from "@mantine/hooks";

export const TocChild = ({
    recDepth = 0,
    isFirst = false,
    toc,
    onClick,
    autoscrollTargetRef,
}: {
    recDepth?: number;
    isFirst?: boolean;
    toc?: Structure;
    onClick?: () => void;
    autoscrollTargetRef?: (node: any) => void;
}) => {
    const { tocNavTo, currentSectionTitle } = useTocNav();

    const isOutermost = recDepth === 0;

    const isActive =
        toc.name === currentSectionTitle || (isFirst && isOutermost && !currentSectionTitle);

    return (
        <NavLink
            className={classes.navLink}
            label={toc.name}
            active={isActive}
            ref={isActive ? autoscrollTargetRef : null}
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
                        onClick={() => tocNavTo(tocChild.sectionId)}
                        autoscrollTargetRef={autoscrollTargetRef}
                    />
                ))}
        </NavLink>
    );
};
