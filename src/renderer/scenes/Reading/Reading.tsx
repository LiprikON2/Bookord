import React, { useEffect, useRef, useState } from "react";
import { useClickOutside, useDisclosure, useHotkeys, useMergedRef } from "@mantine/hooks";
import { useContextMenu } from "mantine-contextmenu";
import { IconCopy, IconLanguage, IconSpeakerphone, IconVocabulary } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import { action, when } from "mobx";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipRefProps } from "react-tooltip";

import context from "~/renderer/ipc/thirdPartyApi";
import { getSetting } from "~/renderer/stores";
import { useBookReadStore } from "~/renderer/stores/hooks";
import { bookKeyRoute } from "~/renderer/appRenderer";
import { useCallbackRef, useEvents, useReadingEvents, useTimeTracker } from "./hooks";
import {
    BookSkeleton,
    BookUi,
    DictionaryTooltip,
    TooltipTarget,
    TranslationTooltip,
} from "./components";
import "./scenes/BookWebComponent";
import type BookWebComponent from "./scenes/BookWebComponent";
import type { BookWebComponentEventMap } from "./scenes/BookWebComponent";
import classes from "./Reading.module.css";
import { Overlay, Portal } from "@mantine/core";
import { useColorScheme } from "~/renderer/hooks";

// TODO https://eisenbergeffect.medium.com/web-components-2024-winter-update-445f27e7613a

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
            if (didSwitchBook) bookReadStore.bookComponent?.unloadBook?.();

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
            bookReadStore.setBookComponent(bookComponent);
            bookReadStore.bookComponent.setOnDisconnect(bookReadStore.unload);
        })
    );
    const handleNextPage = action(() => {
        closeTranslationTooltip();
        closeDictionaryTooltip();
        bookReadStore.bookComponent?.pageForward?.();
    });
    const handlePrevPage = action(() => {
        closeTranslationTooltip();
        closeDictionaryTooltip();
        bookReadStore.bookComponent?.pageBackward?.();
    });
    const handleNextFivePage = action(() => {
        closeTranslationTooltip();
        closeDictionaryTooltip();
        bookReadStore.bookComponent?.flipNPages?.(5);
    });
    const handlePrevFivePage = action(() => {
        closeTranslationTooltip();
        closeDictionaryTooltip();
        bookReadStore.bookComponent?.flipNPages?.(-5);
    });
    const handleNextSection = action(() => {
        closeTranslationTooltip();
        closeDictionaryTooltip();
        bookReadStore.bookComponent?.sectionForward?.();
    });
    const handlePrevSection = action(() => {
        closeTranslationTooltip();
        closeDictionaryTooltip();
        bookReadStore.bookComponent?.sectionBackward?.();
    });

    // Usage of actions prevents `Observable being read outside a reactive context` warning
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

    const eventsRef = useReadingEvents(setTranslateTarget, setDictionaryTarget, {
        icon: classes.icon,
    });

    return (
        <>
            <BookUi
                isReady={bookReadStore.isReady}
                title={bookReadStore.metadata.title}
                uiState={bookReadStore.uiState}
                bookmarked={bookReadStore.isManualBookmarked}
                onAddBookmark={bookReadStore.addManualBookmark}
                onRemoveBookmark={bookReadStore.removeManualBookmark}
                onNextPage={handleNextPage}
                onNextFivePage={handleNextFivePage}
                onNextSection={handleNextSection}
                onPrevPage={handlePrevPage}
                onPrevFivePage={handlePrevFivePage}
                onPrevSection={handlePrevSection}
            >
                <BookSkeleton visible={bookReadStore.isReady} />
                <book-web-component ref={useMergedRef(bookComponentCallbackRef, eventsRef)} />
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
