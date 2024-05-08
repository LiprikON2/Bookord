import React from "react";
import { Skeleton } from "@mantine/core";
import { observer } from "mobx-react-lite";

import classes from "./SkeletonSidebar.module.css";
import clsx from "clsx";

interface SkeletonSidebarProps {
    sidebarPos?: "left" | "right";
}

export const SkeletonSidebar = observer(({ sidebarPos = "left" }: SkeletonSidebarProps) => {
    const skeletonStyle = clsx(classes.skeleton, {
        [classes.skeletonLeft]: sidebarPos === "left",
        [classes.skeletonRight]: sidebarPos === "right",
    });

    return (
        <>
            <Skeleton className={skeletonStyle} />
            <Skeleton className={skeletonStyle} />
            <Skeleton className={skeletonStyle} />
            <Skeleton className={skeletonStyle} />
            <Skeleton className={skeletonStyle} />
            <Skeleton className={skeletonStyle} />
        </>
    );
});
