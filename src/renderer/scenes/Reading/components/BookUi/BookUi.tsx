import React from "react";
import clsx from "clsx";

import classes from "./BookUi.module.css";
import { Box, Group, Stack, Text } from "@mantine/core";

const TextElem = ({ className, children }: { className: string; children: string }) => {
    return (
        <li className={classes.uiElem} title={children}>
            {children}
        </li>
    );
};
const PageElem = ({
    count,
    total,
    title,
    className,
}: {
    count: number;
    total: number;
    title: string;
    className: string;
}) => {
    return (
        <li className={className} title={title}>
            {count && total ? (
                <>
                    <span>{count}</span>/<span>{total}</span>
                </>
            ) : (
                <>
                    <span />
                    <span />
                </>
            )}
        </li>
    );
};

export const BookUi = ({
    uiState,
    visible = true,
    children,
}: {
    uiState: {
        bookTitle: string;
        currentSectionTitle: string;
        currentSectionPage: number;
        totalSectionPages: number;
        currentBookPage: number;
        totalBookPages: number;
    };
    visible?: boolean;
    children?: React.ReactNode;
}) => {
    return (
        // <div className={classes.ui}>
        //     <ul className={classes.uiBlock}>
        //         <TextElem className={classes.uiElem}>{uiState.bookTitle}</TextElem>
        //     </ul>
        //     <div
        //         className={classes.componentContainer}
        //         style={{
        //             visibility: visible ? "visible" : "hidden",
        //         }}
        //     >
        //         {children}
        //     </div>
        //     <ul className={classes.uiBlock}>
        //         <TextElem className={classes.uiElem}>{uiState.currentSectionTitle}</TextElem>
        //         <PageElem
        //             className={clsx(classes.uiElem, classes.digitElem)}
        //             count={uiState.currentSectionPage}
        //             total={uiState.totalSectionPages}
        //             title="Section page"
        //         />

        //         <PageElem
        //             className={clsx(classes.uiElem, classes.digitElem)}
        //             count={uiState.currentBookPage}
        //             total={uiState.totalBookPages}
        //             title="Book page"
        //         />
        //     </ul>
        // </div>

        <Stack h="100%" gap={4}>
            <Group justify="center" px={4}>
                <Text c="dimmed" ta="center" fw={500}>
                    {uiState.bookTitle}
                </Text>
            </Group>
            <Box style={{ overflow: "hidden", flexBasis: "100%" }}>{children}</Box>
            <Group justify="space-between" px={4}>
                <Text c="dimmed" display="inline">
                    Test 2
                </Text>
                <Text c="dimmed" display="inline">
                    Test 3
                </Text>
            </Group>
        </Stack>
    );
};
