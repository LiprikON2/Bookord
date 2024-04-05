import { useEffect } from "react";

import { ViewItem } from "../interfaces";
import { bookViewStore } from "../store";
import { BookMetadata } from "../../BookStore";

export const useUpdateBookViewStore = (metaBookRecords: ViewItem<BookMetadata>[]) => {
    useEffect(() => {
        bookViewStore.populateFilterTagsAll(metaBookRecords);
    }, [metaBookRecords]);
};
