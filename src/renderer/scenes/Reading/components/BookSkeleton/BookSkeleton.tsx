import React from "react";
import { observer } from "mobx-react-lite";
import { Box, Skeleton, SkeletonProps } from "@mantine/core";

import classes from "./BookSkeleton.module.css";

interface BookSkeletonProps {
    visible: boolean;
    skeletonProps?: SkeletonProps;
}

const defaultProps = {
    className: classes.skeleton,
    height: 24,
    mt: 12,
    radius: "sm",
};

export const BookSkeleton = observer(({ visible, skeletonProps }: BookSkeletonProps) => {
    if (!visible) {
        return (
            <Box className={classes.box}>
                <Skeleton mt={defaultProps.mt * 2} {...skeletonProps} />

                {[...Array(15).keys()].map((num) => (
                    <Skeleton key={num} {...defaultProps} {...skeletonProps} />
                ))}
            </Box>
        );
    }

    return <></>;
});
