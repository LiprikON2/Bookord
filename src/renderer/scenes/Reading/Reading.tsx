///<reference path="./components/BookWebComponent/BookWebComponent.d.ts" />
import React from "react";

import { bookKeyRoute } from "~/renderer/appRenderer";
import { BookUi } from "./components";
import { useBookComponent } from "./hooks";
import "./components/BookWebComponent/BookWebComponent";
import classes from "./Reading.module.css";

// TODO https://eisenbergeffect.medium.com/web-components-2024-winter-update-445f27e7613a
export const Reading = () => {
    const { bookKey } = bookKeyRoute.useParams();

    const { bookTitle, uiState, setBookComponentRef } = useBookComponent(bookKey);

    return (
        <>
            <BookUi title={bookTitle} uiState={uiState}>
                <book-web-component class={classes.bookWebComponent} ref={setBookComponentRef} />
            </BookUi>
        </>
    );
};
