import React from "react";

import { bookKeyRoute } from "~/renderer/appRenderer";
import { BookUi } from "./components";
import { useBookComponent } from "./hooks";
import classes from "./Reading.module.css";
import "./components/BookWebComponent";
import { observer } from "mobx-react-lite";

// TODO https://eisenbergeffect.medium.com/web-components-2024-winter-update-445f27e7613a

// TODO fix images displaying over text https://i.imgur.com/7nlOjZt.png

export const Reading = observer(() => {
    const { bookKey } = bookKeyRoute.useParams();

    const { bookTitle, uiState, setBookComponentRef, isReadyToDisplay } = useBookComponent(bookKey);

    return (
        <BookUi title={bookTitle} uiState={uiState}>
            {!isReadyToDisplay && "loading..."}
            <book-web-component class={classes.bookWebComponent} ref={setBookComponentRef} />
        </BookUi>
    );
});
