import React, { forwardRef } from "react";
import { Box, Group, Stack, Text } from "@mantine/core";
import { observer } from "mobx-react-lite";

import classes from "./BookUi.module.css";
import { ToggleActionIcon } from "~/renderer/components";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import clsx from "clsx";

interface BookUiProps {
    title: string;
    uiState: UiState;
    isReady?: boolean;
    children?: React.ReactNode;
    bookmarked: boolean;
    onAddBookmark?: () => void;
    onRemoveBookmark?: () => void;
}

const BookUi = observer(
    // eslint-disable-next-line react/display-name
    forwardRef(
        (
            {
                title,
                uiState,
                onAddBookmark,
                onRemoveBookmark,
                bookmarked = false,
                isReady = true,
                children,
            }: BookUiProps,
            ref: React.ForwardedRef<HTMLDivElement>
        ) => {
            return (
                <Stack h="100%" gap={4} ref={ref}>
                    <Group p={0} className={classes.top}>
                        <Text
                            className={clsx(classes.topCenter, classes.lineClamp)}
                            c="dimmed"
                            ta="center"
                            fw={500}
                        >
                            {title}
                        </Text>
                        {isReady && (
                            <ToggleActionIcon
                                pos="absolute"
                                iconSize="85%"
                                size="md"
                                className={clsx(classes.topRight, classes.bookmark)}
                                OnIcon={IconBookmarkFilled}
                                OffIcon={IconBookmark}
                                variant="transparent"
                                ariaLabel="bookmark"
                                on={bookmarked}
                                onAction={onAddBookmark}
                                offAction={onRemoveBookmark}
                            />
                        )}
                    </Group>
                    <Box style={{ overflow: "hidden", flexBasis: "100%" }} px="md">
                        {children}
                    </Box>
                    <Group justify="space-between" px="md" wrap="nowrap">
                        <Text c="dimmed" className={classes.lineClamp}>
                            {uiState.currentSectionTitle}
                        </Text>
                        <Text c="dimmed">
                            <span>{uiState.currentSectionPage + 1}</span>
                            <span>/</span>
                            <span>{uiState.totalSectionPages}</span>
                        </Text>
                    </Group>
                </Stack>
            );
        }
    )
);

BookUi.displayName = "BookUi";
export { BookUi };
