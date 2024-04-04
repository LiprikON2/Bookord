import { reaction } from "mobx";
import { useContext, useEffect, useState } from "react";

import { bookViewStore, FilterTags } from "..";
import { BookViewStoreContext } from "~/renderer/contexts";

export const useFilterTags = (specialTagCategory: keyof FilterTags = "recent") => {
    const { activeCollectionKey } = useContext(BookViewStoreContext);

    const [categoriesHaveActiveTag, setCategoriesHaveActiveTag] = useState(() =>
        bookViewStore.hasActiveTag([specialTagCategory], activeCollectionKey)
    );

    useEffect(() => {
        const unsub1 = reaction(
            () => bookViewStore.hasActiveTag([specialTagCategory], activeCollectionKey),
            (hasActiveTag) => setCategoriesHaveActiveTag(hasActiveTag)
        );

        return () => {
            unsub1();
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
    };
};
