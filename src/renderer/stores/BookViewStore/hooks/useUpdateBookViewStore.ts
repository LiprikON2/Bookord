import { useContext, useEffect } from "react";

import { ViewItem } from "../interfaces";
import { BookMetadata } from "../../BookStore";
import { RootStoreContext } from "../../RootStoreContext";

export const useUpdateBookViewStore = (metaBookRecords: ViewItem<BookMetadata>[]) => {
    const { bookViewStore } = useContext(RootStoreContext);

    useEffect(() => {
        bookViewStore.populateFilterTagsAll(metaBookRecords);
    }, [metaBookRecords]);
};
