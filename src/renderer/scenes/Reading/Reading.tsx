///<reference path="./components/BookWebComponent/BookWebComponent.d.ts" />
import React, { useEffect } from "react";

import { bookKeyRoute } from "~/renderer/appRenderer";
import { bookStore, useBookContent, useBookMetadata } from "~/renderer/stores";
import { BookUi } from "./components";
import { useWebComponentRef } from "./hooks";
import "./components/BookWebComponent/BookWebComponent";
import classes from "./Reading.module.css";
import { useHotkeys } from "@mantine/hooks";
import { Box, Group, Stack } from "@mantine/core";
import { toJS } from "mobx";

// TODO https://eisenbergeffect.medium.com/web-components-2024-winter-update-445f27e7613a
export const Reading = () => {
    const { bookKey } = bookKeyRoute.useParams();

    const metadata = useBookMetadata(bookKey);
    const { content, contentState } = useBookContent(bookKey, 5);

    const [bookComponentRef, setBookComponentRef, refReadyDecorator] = useWebComponentRef();

    useEffect(() => {
        const bookComponent = bookComponentRef.current;
        if (bookComponent && contentState.isInitSectionParsed) {
            bookComponent.loadBook(contentState, content, metadata);
            // bookComponent.addEventListener("imgClickEvent", handleImgClick);
            // bookComponent.addEventListener("saveBookmarksEvent", handleSavingBookmarks);
            // bookComponent.addEventListener("saveParsedBookEvent", handleSavingParsedBook);
            // bookComponent.addEventListener("uiStateUpdate", handleUiUpdate);
        }
    }, [Object.values(contentState), bookComponentRef.current]);

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
            "Ctrl + Shift + ArrowRight",
            () => refReadyDecorator((bookComponent: any) => bookComponent.sectionForward()),
        ],
        [
            "Ctrl + Shift + ArrowLeft",
            () => refReadyDecorator((bookComponent: any) => bookComponent.sectionBackward()),
        ],
    ]);

    return (
        <>
            {/* <h1>hello {typeof metadata?.title === "string" ? metadata?.title : bookKey}</h1>
            <h1>{contentState?.isInitSectionParsed ? "CONTENT" : "<Blank>"}</h1> */}

            <BookUi
                uiState={{
                    bookTitle: typeof metadata?.title === "string" ? metadata?.title : bookKey,
                    currentSectionTitle: "",
                    currentSectionPage: 0,
                    totalSectionPages: 0,
                    currentBookPage: 0,
                    totalBookPages: 0,
                }}
            >
                <book-web-component class={classes.bookWebComponent} ref={setBookComponentRef} />
            </BookUi>
        </>
    );
};
