import React, { forwardRef } from "react";
import { Box, Group, Stack, Text } from "@mantine/core";
import { observer } from "mobx-react-lite";

import classes from "./BookUi.module.css";
import { ToggleActionIcon } from "~/renderer/components";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import clsx from "clsx";
import { FlipPageButton } from "./components";
import { useKeyboardStrength } from "./hooks";

interface BookUiProps {
    title: string;
    uiState: UiState;
    isReady?: boolean;
    children?: React.ReactNode;
    bookmarked: boolean;
    onAddBookmark?: () => void;
    onRemoveBookmark?: () => void;
    onNextPage?: () => void;
    onNextFivePage?: () => void;
    onNextSection?: () => void;
    onPrevPage?: () => void;
    onPrevFivePage?: () => void;
    onPrevSection?: () => void;
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
                onNextPage,
                onNextFivePage,
                onNextSection,
                onPrevPage,
                onPrevFivePage,
                onPrevSection,
            }: BookUiProps,
            ref: React.ForwardedRef<HTMLDivElement>
        ) => {
            const keyboardStrength = useKeyboardStrength();

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
                    <Group
                        className={classes.buttonContainer}
                        wrap="nowrap"
                        style={{ flexBasis: "100%", overflow: "hidden" }}
                    >
                        {uiState.prevPage && (
                            <FlipPageButton
                                className={classes.backwardButton}
                                direction="left"
                                strength={keyboardStrength}
                                onLowClick={onPrevPage}
                                onMediumClick={onPrevFivePage}
                                onHighClick={onPrevSection}
                            />
                        )}
                        <Box style={{ height: "100%", width: "100%", position: "relative" }}>
                            {children}
                        </Box>
                        {uiState.nextPage && (
                            <FlipPageButton
                                className={classes.forwardButton}
                                direction="right"
                                strength={keyboardStrength}
                                onLowClick={onNextPage}
                                onMediumClick={onNextFivePage}
                                onHighClick={onNextSection}
                            />
                        )}
                    </Group>
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
