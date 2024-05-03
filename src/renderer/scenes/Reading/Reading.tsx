///<reference path="./components/BookWebComponent/BookWebComponent.d.ts" />
import React from "react";

import { bookKeyRoute } from "~/renderer/appRenderer";
import { BookUi } from "./components";
import { useBookComponent } from "./hooks";
import classes from "./Reading.module.css";
import "./components/BookWebComponent";

// TODO https://eisenbergeffect.medium.com/web-components-2024-winter-update-445f27e7613a

// TODO image display bug https://i.imgur.com/7nlOjZt.png

export const Reading = () => {
    const { bookKey } = bookKeyRoute.useParams();

    const { bookTitle, uiState, setBookComponentRef, isReadyToDisplay } = useBookComponent(bookKey);

    return (
        <BookUi title={bookTitle} uiState={uiState}>
            {!isReadyToDisplay && "loading..."}
            <book-web-component class={classes.bookWebComponent} ref={setBookComponentRef} />
        </BookUi>
    );
};
