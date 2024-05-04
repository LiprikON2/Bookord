import React, { memo, useEffect, useState } from "react";
import { NavLink } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { Structure } from "~/renderer/stores";
import classes from "./TocChild.module.css";

export interface TocChildProps {
    key?: string;
    recDepth: number;
    isSelected: boolean;
    toc: Omit<Structure, "children">;
    onClick: () => void;
    tocProps: TocChildProps[] | null;
    hasSelectedChild?: boolean;
    autoscrollTargetRef?: (node: any) => void;
    isVisible?: boolean;
    onSelected?: () => void;
}

// TODO ensure it is perfomant without propsAreEqual ― just with an observer  https://mobx.js.org/react-optimizations.html#render-lists-in-dedicated-components
const propsAreEqual = (
    prevProps: Readonly<TocChildProps>,
    nextProps: Readonly<TocChildProps>
): boolean => {
    const areCurrentPropsEqual =
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.hasSelectedChild === nextProps.hasSelectedChild;
    if (!areCurrentPropsEqual) return areCurrentPropsEqual;

    const areChildPropsNull = prevProps.tocProps === nextProps.tocProps;
    if (areChildPropsNull) return areCurrentPropsEqual;

    const areChildPropsSameLength = prevProps?.tocProps?.length !== nextProps?.tocProps?.length;
    if (areChildPropsSameLength) return false;

    return prevProps.tocProps.every((prevChildProps, index) =>
        propsAreEqual(prevChildProps, nextProps.tocProps[index])
    );
};

// // ref: https://github.com/facebook/react/issues/15156#issuecomment-474590693
// const TocChild = memo(
export const TocChild = observer(
    ({
        isSelected,
        onSelected,
        hasSelectedChild,
        toc,
        onClick,
        autoscrollTargetRef,
        tocProps,
        isVisible = true,
    }: TocChildProps) => {
        const [unfolded, setUnfolded] = useState(hasSelectedChild);

        useEffect(() => {
            if (isSelected && onSelected) onSelected();
        }, [isSelected]);

        const getRef = () => {
            if (isSelected && isVisible) return autoscrollTargetRef;
            return null;
        };

        return (
            <NavLink
                my={2}
                childrenOffset={16}
                className={classes.navLink}
                label={toc.name}
                active={isSelected || hasSelectedChild}
                ref={getRef()}
                onClick={onClick}
                opened={unfolded}
                onChange={setUnfolded}
            >
                {tocProps?.map((tocProp) => (
                    <TocChild
                        key={tocProp.key}
                        {...tocProp}
                        onSelected={() => {
                            if (onSelected) onSelected();
                            setUnfolded(true);
                        }}
                        autoscrollTargetRef={autoscrollTargetRef}
                        isVisible={isVisible && unfolded}
                    />
                ))}
            </NavLink>
        );
    }
    // propsAreEqual
);

// TocChild.displayName = "TocChild";
// export { TocChild };
