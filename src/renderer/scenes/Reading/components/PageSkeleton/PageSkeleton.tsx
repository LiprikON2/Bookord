import React, { useRef } from "react";
import { observer } from "mobx-react-lite";
import { Box, Skeleton, SkeletonProps } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import clsx from "clsx";

import classes from "./PageSkeleton.module.css";

interface PageSkeletonProps {
    visible: boolean;
    className?: string;
    skeletonProps?: SkeletonProps;
}

interface SkeletonLineProps extends SkeletonProps {
    containerRef: any;
}

const defaultProps = {
    className: classes.skeleton,
    height: 24,
    mt: 12,
    radius: "sm",
};

const SkeletonLine = observer(({ containerRef, ...rest }: SkeletonLineProps) => {
    const { ref, entry } = useIntersection({
        root: containerRef.current,
        threshold: 1,
    });

    return (
        <Skeleton
            ref={ref}
            opacity={entry?.isIntersecting ? null : "0%"}
            {...defaultProps}
            {...rest}
        />
    );
});

export const PageSkeleton = observer(({ className, visible, skeletonProps }: PageSkeletonProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    if (!visible) {
        return (
            <Box ref={containerRef} className={clsx(classes.box, className)}>
                {[...Array(30).keys()].map((num) => {
                    return <SkeletonLine key={num} containerRef={containerRef} />;
                })}
            </Box>
        );
    }

    return null;
});
