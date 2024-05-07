import React, { useEffect } from "react";
import { useHotkeys, useMergedRef } from "@mantine/hooks";
import { useContextMenu } from "mantine-contextmenu";
import { IconCopy, IconSpeakerphone } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import { action, when } from "mobx";

import { useBookReadStore } from "~/renderer/stores/hooks";
import { bookKeyRoute } from "~/renderer/appRenderer";
import { useCallbackRef, useEvents } from "./hooks";
import { BookUi } from "./components";
import "./scenes/BookWebComponent";
import type BookWebComponent from "./scenes/BookWebComponent";
import type { BookWebComponentEventMap } from "./scenes/BookWebComponent";
import classes from "./Reading.module.css";

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
            if (didSwitchBook) bookReadStore.bookComponent.unloadBook();

            bookReadStore.setBook(bookKey);
            return unsub;
        }),
        [bookKey]
    );

    const bookComponentCallbackRef = useCallbackRef<BookWebComponent>(
        action((bookComponent) => {
            bookReadStore.setBookComponent(bookComponent);
            bookReadStore.bookComponent.setOnUnload(bookReadStore.unload);
        })
    );

    // Usage of actions prevents `Observable being read outside a reactive context` warning
    useHotkeys([
        ["ArrowRight", action(() => bookReadStore.bookComponent?.pageForward?.())],
        ["ArrowLeft", action(() => bookReadStore.bookComponent?.pageBackward?.())],
        ["Ctrl + ArrowRight", action(() => bookReadStore.bookComponent?.flipNPages?.(5))],
        ["Ctrl + ArrowLeft", action(() => bookReadStore.bookComponent?.flipNPages?.(-5))],
        // TODO on linux this is workspace switching shortcut
        // https://i.imgur.com/IzROIKD.png
        ["Ctrl + Alt + ArrowRight", action(() => bookReadStore.bookComponent?.sectionForward?.())],
        ["Ctrl + Alt + ArrowLeft", action(() => bookReadStore.bookComponent?.sectionBackward?.())],
    ]);

    const { showContextMenu } = useContextMenu();

    const eventsRef = useEvents<BookWebComponentEventMap, BookWebComponent>({
        imgClickEvent: (e) => console.log("click"),
        uiStateUpdateEvent: (e) => bookReadStore.setUiState(e.detail),
        tocStateUpdateEvent: (e) => bookReadStore.setTocState(e.detail),
        autobookmarkPositionEvent: (e) => bookReadStore.setAutobookmark(e.detail.bookmark),
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
            ])(e.detail.event as any);
        },
    });

    return (
        <BookUi title={bookReadStore.metadata.title} uiState={bookReadStore.uiState}>
            {bookReadStore.isManualBookmarked ? (
                <button onClick={bookReadStore.removeManualBookmark}>del bookmark</button>
            ) : (
                <button onClick={bookReadStore.addManualBookmark}>add bookmark</button>
            )}
            {!bookReadStore.isReady && "loading..."}
            <book-web-component ref={useMergedRef(bookComponentCallbackRef, eventsRef)} />
        </BookUi>
    );
});
