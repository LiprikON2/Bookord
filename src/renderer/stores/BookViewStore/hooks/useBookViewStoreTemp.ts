import { reaction } from "mobx";
import { useEffect, useState } from "react";

import { type CollectionKey, bookViewStore, ViewItem, TagName, FilterTags } from "..";
import { BookMetadata } from "../../books";

export const useBookViewStoreTemp = (
    metaBookRecords: ViewItem<BookMetadata>[],
    tagCategory: keyof FilterTags
) => {
    const [activeCollectionKey, setActiveCollectionKey] = useState<CollectionKey | undefined>();

    useEffect(() => {
        bookViewStore.populateFilterTagsAll(metaBookRecords);
    }, [metaBookRecords]);

    return {
        setActiveCollectionKey,
        activeCollectionKey,
    };
};
