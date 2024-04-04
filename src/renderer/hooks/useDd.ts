import { FilterTags, useBookViewStore, useStorageBooks } from "~/renderer/stores";

// ref: https://stackoverflow.com/a/65440349/10744339
export const useDd = (tagCategory: keyof FilterTags) => {
    const { metaBookRecords } = useStorageBooks();
    return useBookViewStore(metaBookRecords, tagCategory);
};
