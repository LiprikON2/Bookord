import { reaction } from "mobx";
import { useEffect, useState } from "react";

import { type CollectionKey, bookViewStore, ViewItem, TagName, FilterTags } from "..";
import { BookMetadata } from "../../books";

export const useBookViewStore = (
    metaBookRecords: ViewItem<BookMetadata>[],
    tagCategory: keyof FilterTags
) => {
    const [activeCollectionKey, setActiveCollectionKey] = useState<CollectionKey | undefined>();
    const [hasActiveTag, setHasActiveTag] = useState(() =>
        bookViewStore.hasActiveTag(["recent"], activeCollectionKey)
    );
    const [tags, setTags] = useState(() => bookViewStore.getTags(tagCategory, activeCollectionKey));
    // const [collection, setCollection] = useState(() => bookViewStore.get(activeCollectionKey));
    const [tagCategoryName, setTagCategoryName] = useState(() =>
        bookViewStore.getTagCategoryName(tagCategory, activeCollectionKey)
    );

    useEffect(() => {
        // const unsub1 = reaction(
        //     () => bookViewStore.get(activeCollectionKey),
        //     (collection) => setCollection(collection)
        // );
        const unsub2 = reaction(
            () => bookViewStore.hasActiveTag(["recent"], activeCollectionKey),
            (hasActiveTag) => setHasActiveTag(hasActiveTag)
        );
        const unsub3 = reaction(
            () => bookViewStore.getTags(tagCategory, activeCollectionKey),
            (tags) => setTags(tags)
        );
        const unsub4 = reaction(
            () => bookViewStore.getTagCategoryName(tagCategory, activeCollectionKey),
            (tagCategoryName) => setTagCategoryName(tagCategoryName)
        );

        return () => {
            // unsub1();
            unsub2();
            unsub3();
            unsub4();
        };
    }, []);

    useEffect(() => {
        bookViewStore.populateFilterTagsAll(metaBookRecords);
    }, [metaBookRecords]);

    const setActiveTag = (tag: TagName, active: boolean) => {
        bookViewStore.setActiveTag(tagCategory, tag, active, activeCollectionKey);
    };
    const setTagsSearchTerm = (searchTerm: string) => {
        bookViewStore.setTagsSearchTerm(searchTerm, tagCategory, activeCollectionKey);
    };

    const resetActiveTags = () => bookViewStore.resetActiveTags(undefined, activeCollectionKey);

    return {
        tagCategoryName,
        tags,
        setActiveTag,
        setTagsSearchTerm,
        setActiveCollectionKey,
        resetActiveTags,
        hasActiveTag,
    };
};
