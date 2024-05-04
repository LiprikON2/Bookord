import { reaction } from "mobx";
import { useContext, useEffect, useState } from "react";

import { BookViewStoreContext } from "~/renderer/contexts";
import { FilterTags } from "..";
import { RootStoreContext } from "../../RootStoreContext";
import { useBookViewStore } from "../../hooks";

export const useFilterTags = (specialTagCategory: keyof FilterTags = "recent") => {
    const bookViewStore = useBookViewStore();

    const { activeCollectionKey } = useContext(BookViewStoreContext);

    const [categoriesHaveActiveTag, setCategoriesHaveActiveTag] = useState(() =>
        bookViewStore.hasActiveTag([specialTagCategory], activeCollectionKey)
    );
    const [searchTerm, setSearchTermValue] = useState(() =>
        bookViewStore.getSearchTerm(activeCollectionKey)
    );

    useEffect(() => {
        const unsub1 = reaction(
            () => bookViewStore.hasActiveTag([specialTagCategory], activeCollectionKey),
            (hasActiveTag) => setCategoriesHaveActiveTag(hasActiveTag)
        );
        const unsub2 = reaction(
            () => bookViewStore.getSearchTerm(),
            (searchTerm) => setSearchTermValue(searchTerm)
        );

        return () => {
            unsub1();
            unsub2();
        };
    }, []);

    const setSearchTerm = (searchTerm: string) => {
        bookViewStore.setSearchTerm(searchTerm, activeCollectionKey);
    };

    const resetActiveTags = () => bookViewStore.resetActiveTags(undefined, activeCollectionKey);

    return {
        resetActiveTags,
        categoriesHaveActiveTag,
        setSearchTerm,
        searchTerm,
    };
};
