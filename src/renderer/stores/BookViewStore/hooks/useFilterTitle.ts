import { useContext } from "react";
import { useFilterTags } from "./useFilterTags";
import { useFilteredBooks } from "./useFilteredBooks";
import { RootStoreContext } from "../../RootStoreContext";

export const useFilterTitle = () => {
    const { bookStore, bookViewStore } = useContext(RootStoreContext);

    const searchTerm = bookViewStore.getSearchTerm(bookViewStore.activeCollectionKey);
    const categoriesHaveActiveTag = bookViewStore.hasActiveTag(
        ["recent"],
        bookViewStore.activeCollectionKey
    );
    const metaBookRecords = bookStore.getBookMetadataInStorage();
    const bookGroups = bookViewStore.apply(metaBookRecords, bookViewStore.activeCollectionKey);
    const visibleBookCount = bookGroups.reduce(
        (acc, cur) => cur.items.filter((item) => item.visible).length,
        0
    );

    const areBooksBeingSearched = searchTerm;
    const areBooksBeingTagFiltered = categoriesHaveActiveTag;
    const areBooksBeingFiltered = areBooksBeingSearched || areBooksBeingTagFiltered;

    if (areBooksBeingFiltered) {
        if (areBooksBeingSearched && !areBooksBeingTagFiltered) {
            if (visibleBookCount > 0) {
                return `Results for '${searchTerm}' (${visibleBookCount})`;
            } else {
                return `No results for '${searchTerm}'`;
            }
        } else if (!areBooksBeingSearched && areBooksBeingTagFiltered) {
            if (visibleBookCount > 0) {
                return `Results for the tags filter (${visibleBookCount})`;
            } else {
                return `No results for the tags filter '${searchTerm}'`;
            }
        } else if (areBooksBeingSearched && areBooksBeingTagFiltered) {
            if (visibleBookCount > 0) {
                return `Results for the tags filter and '${searchTerm}' (${visibleBookCount})`;
            } else {
                return `No results for the tags filter and '${searchTerm}'`;
            }
        }
    } else {
        return `All books (${visibleBookCount})`;
    }
};
