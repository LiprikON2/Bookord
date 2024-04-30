import React, { memo } from "react";
import { NavLink } from "@mantine/core";

import { Structure } from "~/renderer/stores";
import { useTocNav } from "../hooks";
import classes from "./TocChild.module.css";

// ref: https://github.com/facebook/react/issues/15156#issuecomment-474590693
export const TocChild = memo(
    ({
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
        // TODO perfomance issue
        // const { tocNavTo, currentSectionTitle } = useTocNav();

        const isOutermost = recDepth === 0;

        // const isActive =
        //     toc.name === currentSectionTitle || (isFirst && isOutermost && !currentSectionTitle);
        const isActive = false;
        console.log("\t rerender");
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
                            autoscrollTargetRef={autoscrollTargetRef}
                            // onClick={() => tocNavTo(tocChild.sectionId)}
                        />
                    ))}
            </NavLink>
        );
    }
);
