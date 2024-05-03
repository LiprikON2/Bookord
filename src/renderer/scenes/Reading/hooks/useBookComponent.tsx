import React from "react";
import { IconCopy, IconSpeakerphone } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import { useHotkeys } from "@mantine/hooks";
import { useContextMenu } from "mantine-contextmenu";
import { toJS } from "mobx";

import { BookComponentContext, BookComponentTocContext } from "~/renderer/contexts";
import { BookKey, useBookContent, useBookInteractions, useBookMetadata } from "~/renderer/stores";
import BookWebComponent, { BookWebComponentEventMap } from "../components/BookWebComponent";
import { useWebComponent } from "./useWebComponent";
import classes from "./useBookComponent.module.css";

export const useBookComponent = (bookKey: BookKey) => {
    const metadata = useBookMetadata(bookKey);
    const { autobookmark, setAutobookmark } = useBookInteractions(bookKey);
    console.log("autobookmark", toJS(autobookmark), bookKey);

    const { content, contentState } = useBookContent(bookKey, autobookmark?.elementSection ?? 0);

    const { setContextRef, contextUiState, setContextUiState, setTtsTarget } =
        useContext(BookComponentContext);

    const { setTocState } = useContext(BookComponentTocContext);

    const { showContextMenu } = useContextMenu();

    // prettier-ignore
    const [bookComponentRef, setBookComponentRef, refReadyDecorator] = useWebComponent<
        BookWebComponentEventMap,
        BookWebComponent
    >(
        [
            {
                type: "imgClickEvent",
                listener: (e: BookWebComponentEventMap["imgClickEvent"]) => console.log("click"),
            },
            {
                type: "uiStateUpdateEvent",
                listener: (e: BookWebComponentEventMap["uiStateUpdateEvent"]) =>
                    setContextUiState(e.detail),
            },
            {
                type: "tocStateUpdateEvent",
                listener: (e: BookWebComponentEventMap["tocStateUpdateEvent"]) =>
                    setTocState(e.detail),
            },
            {
                type: "autobookmarkPositionEvent",
                listener: (e: BookWebComponentEventMap["autobookmarkPositionEvent"]) => 
                    setAutobookmark(e.detail.bookmark)
                ,
            },
            {
                type: "contextMenuEvent",
                listener: (e) => {
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
                                setTtsTarget({ startElement, startElementSelectedText });
                            },
                        },
                    ])(e.detail.event);
                },
            },
        ],
        (webComponent) => setContextRef(webComponent)
    );

    useHotkeys([
        [
            "ArrowRight",
            () => refReadyDecorator((bookComponent: any) => bookComponent.pageForward()),
        ],
        [
            "ArrowLeft",
            () => refReadyDecorator((bookComponent: any) => bookComponent.pageBackward()),
        ],
        [
            "Ctrl + ArrowRight",
            () => refReadyDecorator((bookComponent: any) => bookComponent.flipNPages(5)),
        ],
        [
            "Ctrl + ArrowLeft",
            () => refReadyDecorator((bookComponent: any) => bookComponent.flipNPages(-5)),
        ],
        // TODO on linux this is workspace switching shortcut
        // https://i.imgur.com/IzROIKD.png
        [
            "Ctrl + Alt + ArrowRight",
            () => refReadyDecorator((bookComponent: any) => bookComponent.sectionForward()),
        ],
        [
            "Ctrl + Alt + ArrowLeft",
            () => refReadyDecorator((bookComponent: any) => bookComponent.sectionBackward()),
        ],
    ]);

    const bookTitle = typeof metadata?.title === "string" ? metadata?.title : bookKey;
    const isReadyToDisplay = Boolean(bookComponentRef.current && contentState.isInitSectionParsed);

    useEffect(() => {
        console.log("loading book", isReadyToDisplay);
        if (isReadyToDisplay) bookComponentRef.current.loadBook(contentState, content, metadata);
    }, [isReadyToDisplay]);

    return { uiState: contextUiState, setBookComponentRef, bookTitle, isReadyToDisplay };
};
