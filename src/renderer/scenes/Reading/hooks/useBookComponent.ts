import { useContext, useEffect, useState } from "react";
import { useHotkeys } from "@mantine/hooks";

import { BookComponentContext } from "~/renderer/contexts";
import { BookKey, useBookContent, useBookMetadata } from "~/renderer/stores";
import BookWebComponent, { BookWebComponentEventMap } from "../components/BookWebComponent";
import { useWebComponent } from "./useWebComponent";

export const useBookComponent = (bookKey: BookKey) => {
    const metadata = useBookMetadata(bookKey);
    const { content, contentState } = useBookContent(bookKey, 0);

    const { setContextRef, contextUiState, setContextUiState } = useContext(BookComponentContext);

    const [bookComponentRef, setBookComponentRef, refReadyDecorator] = useWebComponent<
        BookWebComponentEventMap,
        BookWebComponent
    >(
        [
            {
                type: "imgClickEvent",
                listener: () => console.log("click"),
            },
            {
                type: "uiStateUpdate",
                listener: (e) => setContextUiState(e.detail),
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
        if (isReadyToDisplay) bookComponentRef.current.loadBook(contentState, content, metadata);
    }, [isReadyToDisplay]);

    return { uiState: contextUiState, setBookComponentRef, bookTitle, isReadyToDisplay };
};
