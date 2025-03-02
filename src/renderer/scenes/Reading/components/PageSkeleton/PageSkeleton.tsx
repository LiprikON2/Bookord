import React from "react";
import { observer } from "mobx-react-lite";
import { Box, Skeleton, SkeletonProps } from "@mantine/core";
import clsx from "clsx";

import classes from "./PageSkeleton.module.css";

interface PageSkeletonProps {
    visible: boolean;
    className?: string;
    skeletonProps?: SkeletonProps;
}

const defaultProps = {
    className: classes.skeleton,
    height: 24,
    mt: 12,
    radius: "sm",
};

export const PageSkeleton = observer(({ className, visible, skeletonProps }: PageSkeletonProps) => {
    if (!visible) {
        return (
            <Box className={clsx(classes.box, className)}>
                <Skeleton mt={defaultProps.mt * 2} {...skeletonProps} />

                {[...Array(15).keys()].map((num) => (
                    <Skeleton key={num} {...defaultProps} {...skeletonProps} />
                ))}
            </Box>
        );
    }

    return null;
});
