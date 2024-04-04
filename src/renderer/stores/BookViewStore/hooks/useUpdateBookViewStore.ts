import { useEffect } from "react";

import { ViewItem } from "../interfaces";
import { bookViewStore } from "../store";
import { BookMetadata } from "../../books";

export const useUpdateBookViewStore = (metaBookRecords: ViewItem<BookMetadata>[]) => {
    useEffect(() => {
        bookViewStore.populateFilterTagsAll(metaBookRecords);
    }, [metaBookRecords]);
};
