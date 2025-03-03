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
    console.log("entry?.isIntersecting", entry?.isIntersecting);

    return (
        <Skeleton
            ref={ref}
            opacity={entry?.isIntersecting ? null : "0%"}
            {...defaultProps}
            {...rest}
        />
    );
});

const createIndentProps = (index: number, n: number = 6) => {
    if (index % n === 0) {
        return {
            ml: "auto",
            mt: "lg",
            width: "92.5%",
        };
    }
    if (index % n === n - 1) {
        return {
            width: "85%",
        };
    }

    return {};
};

export const PageSkeleton = observer(
    ({ className, visible = true, skeletonProps }: PageSkeletonProps) => {
        const containerRef = useRef<HTMLDivElement>(null);

        if (visible) {
            return (
                <Box ref={containerRef} className={clsx(classes.box, className)}>
                    {[...Array(30).keys()].map((index) => {
                        return (
                            <SkeletonLine
                                key={index}
                                containerRef={containerRef}
                                {...skeletonProps}
                                {...createIndentProps(index)}
                            />
                        );
                    })}
                </Box>
            );
        }

        return null;
    }
);
