import { useFilterTags } from "./useFilterTags";
import { useFilteredBooks } from "./useFilteredBooks";

export const useFilterTitle = () => {
    const { searchTerm, categoriesHaveActiveTag } = useFilterTags();
    const { visibleBookCount, inStorageBookCount } = useFilteredBooks();

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
