import React from "react";
import { useContextMenu } from "mantine-contextmenu";
import {
    IconCopy,
    IconHighlight,
    IconLanguage,
    IconSpeakerphone,
    IconVocabulary,
} from "@tabler/icons-react";

import { useBookReadStore } from "~/renderer/stores/hooks";
import { EventMap, useEvents } from "../hooks";
import { HighlightContextMenuTooltipTarget, TooltipTarget } from "../components";
import type BookWebComponent from "../scenes/BookWebComponent";
import type { BookWebComponentEventMap } from "../scenes/BookWebComponent";

export const useReadingEvents = (
    setTranslateTarget: (target: TooltipTarget) => void,
    setDictionaryTarget: (target: TooltipTarget) => void,
    setHighlightContextMenuTarget: (target: HighlightContextMenuTooltipTarget) => void,
    classNames?: { icon: string }
) => {
    const bookReadStore = useBookReadStore();

    const { showContextMenu } = useContextMenu();
    const { showContextMenu: showWrapContextMenu } = useContextMenu();

    const incomingEvents: EventMap<BookWebComponentEventMap> = {
        imgClickEvent: (e) => console.log("click"),

        contextMenuEvent: (e) => {
            showContextMenu([
                {
                    key: "copy",
                    icon: <IconCopy className={classNames?.icon} />,
                    onClick: () => navigator.clipboard.writeText(e.detail.selectedText),
                },
                {
                    key: "highlight",
                    icon: <IconHighlight className={classNames?.icon} />,
                    onClick: () => bookReadStore.highlight(e.detail.wrapper),
                    hidden: !e.detail.canBeHighlighted,
                },

                {
                    key: "translate",
                    icon: <IconLanguage className={classNames?.icon} />,
                    onClick: () => {
                        const { selectedText, selectionPosition } = e.detail;

                        setTranslateTarget({
                            text: selectedText,
                            position: selectionPosition,
                        });
                    },
                },
                {
                    key: "definition",
                    icon: <IconVocabulary className={classNames?.icon} />,
                    onClick: () => {
                        const { selectedText, selectionPosition } = e.detail;

                        setDictionaryTarget({
                            text: selectedText,
                            position: selectionPosition,
                        });
                    },
                },
                {
                    key: "tts",
                    icon: <IconSpeakerphone className={classNames?.icon} />,
                    title: "Text-to-Speech",
                    onClick: () => {
                        const { startElement, startElementSelectedText } = e.detail;
                        bookReadStore.setTtsTarget({ startElement, startElementSelectedText });
                    },
                },
            ])(e.detail.event as any);
        },

        wrapContextMenuEvent: (e) => {
            const { firstWrapBlockPosition, instanceAttrs } = e.detail;

            setHighlightContextMenuTarget({
                instanceAttrs,
                position: firstWrapBlockPosition,
            });

            // showWrapContextMenu([
            //     {
            //         key: "highlight",
            //         icon: <IconHighlight className={classNames?.icon} />,
            //         onClick: () => console.log("hey"),
            //     },
            // ])(e.detail.event as any);
        },
    };

    const incomingEventsRef1 = useEvents<BookWebComponentEventMap, BookWebComponent>(
        incomingEvents
    );
    const incomingEventsRef2 = useEvents<BookWebComponentEventMap, BookWebComponent>(
        incomingEvents
    );
    const outgoingEventsRef = useEvents<BookWebComponentEventMap, BookWebComponent>({
        uiStateUpdateEvent: (e) => bookReadStore.setUiState(e.detail),
        tocStateUpdateEvent: (e) => bookReadStore.setTocState(e.detail),
        bookmarkPositionsEvent: (e) => {
            bookReadStore.setBookmarkablePositions(e.detail.manual);
            bookReadStore.setAutobookmark(e.detail.auto);
        },
        wrapEvent: (e) => {
            console.log("wrap! e.detail", e.detail);
            // TODO make e.detail a wrapEvent with type of {wrapper: Wrapper; type: "add" | "remove"}
            // TODO rename addHighlight to pushWrapEvent
            bookReadStore.addHighlight(e.detail);
        },
    });

    return [outgoingEventsRef, incomingEventsRef1, incomingEventsRef2];
};
