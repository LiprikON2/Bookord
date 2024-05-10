import React from "react";
import { useContextMenu } from "mantine-contextmenu";
import { IconCopy, IconLanguage, IconSpeakerphone, IconVocabulary } from "@tabler/icons-react";

import { useBookReadStore } from "~/renderer/stores/hooks";
import { useEvents } from "../hooks";
import { TooltipTarget } from "../components";
import type BookWebComponent from "../scenes/BookWebComponent";
import type { BookWebComponentEventMap } from "../scenes/BookWebComponent";

export const useReadingEvents = (
    setTranslateTarget: (target: TooltipTarget) => void,
    setDictionaryTarget: (target: TooltipTarget) => void,
    classNames?: { icon: string }
) => {
    const bookReadStore = useBookReadStore();

    const { showContextMenu } = useContextMenu();

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
                    icon: <IconCopy className={classNames?.icon} />,
                    onClick: () => navigator.clipboard.writeText(e.detail.selectedText),
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
    });

    return eventsRef;
};
