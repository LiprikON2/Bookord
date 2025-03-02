import React, { forwardRef } from "react";
import { Box, Group, Stack, Text } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import clsx from "clsx";

import { useBookReadStore } from "~/renderer/stores";
import { ToggleActionIcon } from "~/renderer/components";
import { FlipPageButton } from "./components";
import { useKeyboardStrength } from "./hooks";
import classes from "./BookUi.module.css";

interface BookUiProps {
    children?: React.ReactNode;
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
                onAddBookmark,
                onRemoveBookmark,
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
            const bookReadStore = useBookReadStore();

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
                            {bookReadStore.metadata.title}
                        </Text>
                        {bookReadStore.isReady && (
                            <ToggleActionIcon
                                pos="absolute"
                                iconSize="85%"
                                size="md"
                                className={clsx(classes.topRight, classes.bookmark)}
                                OnIcon={IconBookmarkFilled}
                                OffIcon={IconBookmark}
                                variant="transparent"
                                ariaLabel="bookmark"
                                on={bookReadStore.isManualBookmarked}
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
                        {bookReadStore.uiState.prevPage && (
                            <FlipPageButton
                                className={classes.backwardButton}
                                direction="left"
                                strength={keyboardStrength}
                                onLowClick={onPrevPage}
                                onMediumClick={onPrevFivePage}
                                onHighClick={onPrevSection}
                            />
                        )}
                        {children}
                        {bookReadStore.uiState.nextPage && (
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
                            {bookReadStore.uiState.currentSectionTitle}
                        </Text>
                        <Text c="dimmed">
                            <span>{bookReadStore.uiState.currentSectionPage + 1}</span>
                            <span>/</span>
                            <span>{bookReadStore.uiState.totalSectionPages}</span>
                        </Text>
                    </Group>
                </Stack>
            );
        }
    )
);

BookUi.displayName = "BookUi";
export { BookUi };
