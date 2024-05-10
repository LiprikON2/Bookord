import React, { useEffect, useRef, useState } from "react";
import { useClickOutside, useHotkeys, useMergedRef } from "@mantine/hooks";
import { useContextMenu } from "mantine-contextmenu";
import { IconCopy, IconLanguage, IconSpeakerphone } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import { action, when } from "mobx";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipRefProps } from "react-tooltip";

import context from "~/renderer/ipc/thirdPartyApi";
import { getSetting } from "~/renderer/stores";
import { useBookReadStore } from "~/renderer/stores/hooks";
import { bookKeyRoute } from "~/renderer/appRenderer";
import { useCallbackRef, useEvents, useTimeTracker } from "./hooks";
import { BookSkeleton, BookUi } from "./components";
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
        dismissTooltip();
        bookReadStore.bookComponent?.pageForward?.();
    });
    const handlePrevPage = action(() => {
        dismissTooltip();
        bookReadStore.bookComponent?.pageBackward?.();
    });
    const handleNextFivePage = action(() => {
        dismissTooltip();
        bookReadStore.bookComponent?.flipNPages?.(5);
    });
    const handlePrevFivePage = action(() => {
        dismissTooltip();
        bookReadStore.bookComponent?.flipNPages?.(-5);
    });
    const handleNextSection = action(() => {
        dismissTooltip();
        bookReadStore.bookComponent?.sectionForward?.();
    });
    const handlePrevSection = action(() => {
        dismissTooltip();
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

    const { showContextMenu } = useContextMenu();

    const targetLang = "RU";
    const [translateTarget, setTranslateTarget] = useState<{
        text: string | null;
        position: { x: number; y: number } | null;
    }>({
        text: null,
        position: null,
    });

    const { data: translation } = useQuery({
        queryKey: ["deepl", translateTarget.text, targetLang] as [string, string, string],
        queryFn: ({ queryKey: [_, text, targetLang] }) => {
            const deeplKey = getSetting(["General", "API", "Language", "DeepL API key"]).value;
            return context.apiDeepl(text, targetLang, deeplKey);
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        enabled: translateTarget !== null,
    });

    useEffect(() => {
        if (translation) setTooltipOpened(true);
    }, [translation]);

    const tooltipRef = useRef<TooltipRefProps>(null);
    const [tooltipOpened, setTooltipOpened] = useState(false);
    const dismissTooltip = () => setTooltipOpened(false);

    useEffect(() => {
        if (tooltipOpened)
            tooltipRef.current?.open({ content: translation, position: translateTarget.position });
        else tooltipRef.current?.close();
    }, [tooltipOpened]);

    const eventsRef = useEvents<BookWebComponentEventMap, BookWebComponent>({
        imgClickEvent: (e) => console.log("click"),
        uiStateUpdateEvent: (e) => bookReadStore.setUiState(e.detail),
        tocStateUpdateEvent: (e) => bookReadStore.setTocState(e.detail),
        bookmarkPositionsEvent: (e) => {
            bookReadStore.setBookmarkablePositions(e.detail.manual);
            bookReadStore.setAutobookmark(e.detail.auto);
        },
        contextMenuEvent: (e) => {
            showContextMenu([
                {
                    key: "copy",
                    icon: <IconCopy className={classes.icon} />,
                    onClick: () => navigator.clipboard.writeText(e.detail.selectedText),
                },
                {
                    key: "tts",
                    icon: <IconSpeakerphone className={classes.icon} />,
                    title: "Text-to-Speech",
                    onClick: () => {
                        const { startElement, startElementSelectedText } = e.detail;
                        bookReadStore.setTtsTarget({ startElement, startElementSelectedText });
                    },
                },
                {
                    key: "translate",
                    icon: <IconLanguage className={classes.icon} />,
                    onClick: () => {
                        const { selectedText, selectionPosition } = e.detail;

                        setTranslateTarget({
                            text: selectedText,
                            position: selectionPosition,
                        });
                    },
                },
            ])(e.detail.event as any);
        },
    });

    const { colorSceme } = useColorScheme();
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
            <Portal>
                <Tooltip
                    id="translation"
                    className={classes.tooltip}
                    ref={tooltipRef}
                    imperativeModeOnly
                    variant={colorSceme}
                    opacity={1}
                />
                {tooltipOpened && <Overlay onClick={dismissTooltip} opacity={0} />}
            </Portal>
        </>
    );
});
