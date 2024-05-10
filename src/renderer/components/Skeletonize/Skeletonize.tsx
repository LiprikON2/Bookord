import React from "react";
import { observer } from "mobx-react-lite";
import { Skeleton, SkeletonProps } from "@mantine/core";

interface SkeletonizeProps {
    visible: boolean;
    preserveChildren?: boolean;
    skeleton?: React.ReactNode;
    skeletonCount?: number;
    skeletonProps?: SkeletonProps;
    children: React.ReactNode;
}

const defaultProps = {
    height: 24,
    mt: 12,
    radius: "sm",
};

export const Skeletonize = observer(
    ({
        visible,
        skeleton,
        children,
        skeletonCount = 4,
        skeletonProps = { height: 24, mt: 12, radius: "sm" },
        preserveChildren = false,
    }: SkeletonizeProps) => {
        if (!visible && skeleton) {
            return (
                <>
                    {skeleton}
                    {preserveChildren && children}
                </>
            );
        }
        if (!visible) {
            return (
                <>
                    {[...Array(skeletonCount).keys()].map((num) => (
                        <Skeleton key={num} {...defaultProps} {...skeletonProps} />
                    ))}
                    {preserveChildren && children}
                </>
            );
        }

        return children;
    }
);
