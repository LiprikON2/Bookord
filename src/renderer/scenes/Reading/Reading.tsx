import React, { useEffect } from "react";
import { useHotkeys, useMergedRef } from "@mantine/hooks";
import { useContextMenu } from "mantine-contextmenu";
import { IconCopy, IconSpeakerphone } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import { action } from "mobx";

import { useBookReadStore } from "~/renderer/stores/hooks";
import { bookKeyRoute } from "~/renderer/appRenderer";
import { useCallbackRef, useEvents } from "./hooks";
import { BookUi } from "./components";
import "./components/BookWebComponent";
import type BookWebComponent from "./components/BookWebComponent";
import type { BookWebComponentEventMap } from "./components/BookWebComponent";
import classes from "./Reading.module.css";

// TODO https://eisenbergeffect.medium.com/web-components-2024-winter-update-445f27e7613a

// TODO fix images displaying over text https://i.imgur.com/7nlOjZt.png

export const Reading = observer(() => {
    const { bookKey } = bookKeyRoute.useParams();
    const bookReadStore = useBookReadStore();

    useEffect(() => {
        bookReadStore.setBook(bookKey);
    }, [bookKey]);

    const bookComponentCallbackRef = useCallbackRef<BookWebComponent>((bookComponent) => {
        bookReadStore.setBookComponent(bookComponent);
        // bookComponent.onUnload = () => bookReadStore.unload();
    });

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
            {!bookReadStore.isReady && "loading..."}
            <book-web-component
                class={classes.bookWebComponent}
                ref={useMergedRef(bookComponentCallbackRef, eventsRef)}
            />
        </BookUi>
    );
});
