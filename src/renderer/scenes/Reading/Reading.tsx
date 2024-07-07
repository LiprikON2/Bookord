import React, { useEffect, useState } from "react";
import { Box } from "@mantine/core";
import { useDisclosure, useHotkeys, useMergedRef } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import { action, when } from "mobx";

import { useBookReadStore } from "~/renderer/stores/hooks";
import { bookKeyRoute } from "~/renderer/appRenderer";
import { useCallbackRef, useReadingEvents, useTimeTracker } from "./hooks";
import {
    BookSkeleton,
    BookUi,
    DictionaryTooltip,
    TooltipTarget,
    TranslationTooltip,
} from "./components";
import "./scenes/BookWebComponent";
import type BookWebComponent from "./scenes/BookWebComponent";
import classes from "./Reading.module.css";

// TODO fix images displaying over text https://i.imgur.com/7nlOjZt.png
export const Reading = observer(() => {
    const { bookKey } = bookKeyRoute.useParams();
    const bookReadStore = useBookReadStore();

    useEffect(
        action(() => {
            const unsub = when(
                () => bookReadStore.isReady,
                () => bookReadStore.load()
            );

            const didSwitchBook = bookReadStore.book !== null;
            if (didSwitchBook) bookReadStore.unloadBook();

            bookReadStore.setBook(bookKey);
            return unsub;
        }),
        [bookKey]
    );

    useTimeTracker(
        action((activeDuration, idleDuration) => {
            bookReadStore.addTimeRecord({
                activeDuration,
                idleDuration,
                endDate: new Date(),
                endBookmark: bookReadStore.autobookmark,
                progress: bookReadStore.currentProgress,
            });
        })
    );

    const bookComponentCallbackRef = useCallbackRef<BookWebComponent>(
        action((bookComponent) => {
            bookReadStore.setLeftPageComponent(bookComponent);
            bookReadStore.pageComponents.left.setOnDisconnect(bookReadStore.unload);
        })
    );
    const bookComponentCallbackRef2 = useCallbackRef<BookWebComponent>(
        action((bookComponent2) => {
            bookReadStore.setRightPageComponent(bookComponent2);
            bookReadStore.pageComponents.right.setOnDisconnect(bookReadStore.unload);
        })
    );
    const handleNextPage = action(() => {
        closeTranslationTooltip();
        closeDictionaryTooltip();
        bookReadStore.pageForward();
    });
    const handlePrevPage = action(() => {
        closeTranslationTooltip();
        closeDictionaryTooltip();
        bookReadStore.pageBackward();
    });
    const handleNextFivePage = action(() => {
        closeTranslationTooltip();
        closeDictionaryTooltip();
        bookReadStore.flipNPages(5);
    });
    const handlePrevFivePage = action(() => {
        closeTranslationTooltip();
        closeDictionaryTooltip();
        bookReadStore.flipNPages(-5);
    });
    const handleNextSection = action(() => {
        closeTranslationTooltip();
        closeDictionaryTooltip();
        bookReadStore.sectionForward();
    });
    const handlePrevSection = action(() => {
        closeTranslationTooltip();
        closeDictionaryTooltip();
        bookReadStore.sectionBackward();
    });

    useHotkeys([
        ["ArrowRight", handleNextPage],
        ["ArrowLeft", handlePrevPage],
        ["Ctrl + ArrowRight", handleNextFivePage],
        ["Ctrl + ArrowLeft", handlePrevFivePage],
        ["Shift + ArrowRight", handleNextFivePage],
        ["Shift + ArrowLeft", handlePrevFivePage],
        ["Ctrl + Alt + ArrowRight", handleNextSection],
        ["Ctrl + Alt + ArrowLeft", handlePrevSection],
        ["Shift + Alt + ArrowRight", handleNextSection],
        ["Shift + Alt + ArrowLeft", handlePrevSection],
    ]);

    const [translateTarget, setTranslateTarget] = useState<TooltipTarget>({
        text: null,
        position: null,
    });
    const [
        translationTooltipOpened,
        { open: openTranslationTooltip, close: closeTranslationTooltip },
    ] = useDisclosure(false);

    const [dictionaryTarget, setDictionaryTarget] = useState<TooltipTarget>({
        text: null,
        position: null,
    });
    const [
        dictionaryTooltipOpened,
        { open: openDictionaryTooltip, close: closeDictionaryTooltip },
    ] = useDisclosure(false);

    const [outgoingEventsRef, incomingEventsRef1, incomingEventsRef2] = useReadingEvents(
        setTranslateTarget,
        setDictionaryTarget,
        {
            icon: classes.icon,
        }
    );

    return (
        <>
            <BookUi
                onAddBookmark={bookReadStore.addManualBookmark}
                onRemoveBookmark={bookReadStore.removeManualBookmark}
                onNextPage={handleNextPage}
                onNextFivePage={handleNextFivePage}
                onNextSection={handleNextSection}
                onPrevPage={handlePrevPage}
                onPrevFivePage={handlePrevFivePage}
                onPrevSection={handlePrevSection}
            >
                <Box className={classes.pageContainer}>
                    <BookSkeleton
                        className={classes.pageSkeleton}
                        visible={bookReadStore.isReady}
                    />
                    <book-web-component
                        ref={useMergedRef(
                            bookComponentCallbackRef,
                            outgoingEventsRef,
                            incomingEventsRef1
                        )}
                    />
                </Box>
                <Box
                    className={classes.pageContainer}
                    display={bookReadStore.layout === "two-page" ? undefined : "none"}
                >
                    <BookSkeleton
                        className={classes.pageSkeleton}
                        visible={bookReadStore.isReady}
                    />
                    <book-web-component
                        ref={useMergedRef(bookComponentCallbackRef2, incomingEventsRef2)}
                    />
                </Box>
            </BookUi>
            <TranslationTooltip
                target={translateTarget}
                opened={translationTooltipOpened}
                onOpen={openTranslationTooltip}
                onClose={closeTranslationTooltip}
            />
            <DictionaryTooltip
                target={dictionaryTarget}
                opened={dictionaryTooltipOpened}
                onOpen={openDictionaryTooltip}
                onClose={closeDictionaryTooltip}
            />
        </>
    );
});
