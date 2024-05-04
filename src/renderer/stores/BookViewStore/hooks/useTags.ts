import { reaction } from "mobx";
import { useContext, useEffect, useState } from "react";

import { BookViewStoreContext } from "~/renderer/contexts";
import { TagName, FilterTags } from "..";
import { RootStoreContext } from "../../RootStoreContext";

export const useTags = (tagCategory: keyof FilterTags) => {
    const { bookViewStore } = useContext(RootStoreContext);

    const { activeCollectionKey } = useContext(BookViewStoreContext);

    const [tags, setTags] = useState(() => bookViewStore.getTags(tagCategory, activeCollectionKey));
    const [tagCategoryName, setTagCategoryName] = useState(() =>
        bookViewStore.getTagCategoryName(tagCategory, activeCollectionKey)
    );

    const [categoryHaveActiveTag, setCategoryHaveActiveTag] = useState(() =>
        bookViewStore.categoryHasActiveTag(tagCategory, activeCollectionKey)
    );

    useEffect(() => {
        const unsub1 = reaction(
            () => bookViewStore.getTags(tagCategory, activeCollectionKey),
            (tags) => setTags(tags)
        );
        const unsub2 = reaction(
            () => bookViewStore.getTagCategoryName(tagCategory, activeCollectionKey),
            (tagCategoryName) => setTagCategoryName(tagCategoryName)
        );

        const unsub3 = reaction(
            () => bookViewStore.categoryHasActiveTag(tagCategory, activeCollectionKey),
            (categoryHaveActiveTag) => setCategoryHaveActiveTag(categoryHaveActiveTag)
        );

        return () => {
            unsub1();
            unsub2();
            unsub3();
        };
    }, []);

    const resetTagCategory = () => {
        bookViewStore.resetActiveTags(tagCategory, activeCollectionKey);
    };

    const setActiveTag = (tag: TagName, active: boolean) => {
        bookViewStore.setActiveTag(tagCategory, tag, active, activeCollectionKey);
    };
    const setTagsSearchTerm = (searchTerm: string) => {
        bookViewStore.setTagsSearchTerm(searchTerm, tagCategory, activeCollectionKey);
    };

    return {
        tagCategoryName,
        tags,
        setActiveTag,
        setTagsSearchTerm,
        resetTagCategory,
        categoryHaveActiveTag,
    };
};
