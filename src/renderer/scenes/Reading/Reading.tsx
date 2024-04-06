///<reference path="./components/BookWebComponent/BookWebComponent.d.ts" />
import React, { useEffect, useState } from "react";
import { useEventListener, useHotkeys } from "@mantine/hooks";
import { Box, Group, Stack } from "@mantine/core";
import { toJS } from "mobx";

import { bookKeyRoute } from "~/renderer/appRenderer";
import { bookStore, useBookContent, useBookMetadata } from "~/renderer/stores";
import { BookUi } from "./components";
import { useWebComponent } from "./hooks";
import classes from "./Reading.module.css";
import type BookWebComponent from "./components/BookWebComponent/BookWebComponent";
import type { BookWebComponentEventMap } from "./components/BookWebComponent/BookWebComponent";
import "./components/BookWebComponent/BookWebComponent";

// TODO https://eisenbergeffect.medium.com/web-components-2024-winter-update-445f27e7613a
export const Reading = () => {
    const { bookKey } = bookKeyRoute.useParams();

    const metadata = useBookMetadata(bookKey);
    const { content, contentState } = useBookContent(bookKey, 5);

    const [uiState, setUiState] = useState({
        currentSectionTitle: "",
        currentSectionPage: 0,
        totalSectionPages: 0,
        currentBookPage: 0,
        totalBookPages: 0,
    });

    const handleImgClick = () => {
        console.log("click");
    };

    const [bookComponentRef, setBookComponentRef, refReadyDecorator] = useWebComponent<
        BookWebComponentEventMap,
        BookWebComponent
    >([
        {
            type: "imgClickEvent",
            listener: () => handleImgClick(),
        },
        {
            type: "uiStateUpdate",
            listener: (e) => {
                console.log("e.detail", e.detail);
                setUiState(e.detail);
            },
        },
    ]);

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

    useEffect(() => {
        const bookComponent = bookComponentRef.current;
        const isReadyToDisplay = bookComponent && contentState.isInitSectionParsed;

        if (isReadyToDisplay) bookComponent.loadBook(contentState, content, metadata);
    }, [contentState.isInitSectionParsed, bookComponentRef.current]);

    const bookTitle = typeof metadata?.title === "string" ? metadata?.title : bookKey;

    return (
        <BookUi title={bookTitle} uiState={uiState}>
            <book-web-component class={classes.bookWebComponent} ref={setBookComponentRef} />
        </BookUi>
    );
};
