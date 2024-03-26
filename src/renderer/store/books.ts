import { action, observable, autorun, set, toJS, computed, runInAction } from "mobx";
import _ from "lodash";

import { isDev } from "~/common/helpers";
import context from "../scenes/Library/scenes/BookGrid/ipc";
import Fuse from "fuse.js";

declare global {
    interface Window {
        booksStore?: typeof booksStore;
    }
}

const initBookMetadata = {
    title: "",
    description: "",
    date: "",
    cover: "",
    author: "",
    indentifiers: [] as string[],
    languages: [] as string[],
    relations: [] as string[],
    subjects: [] as string[],
    publishers: [] as string[],
    contributors: [] as string[],
    coverages: [] as string[],
    rights: [] as string[],
    sources: [] as string[],
};

const getMetadataYear = (metadata: Metadata) => {
    const year = new Date(metadata.date).getFullYear();
    const yearString = Number.isNaN(year) ? "Unknown" : year.toString();

    return yearString;
};

export type Metadata = typeof initBookMetadata;

export type Books = {
    [key: string]: { metadata: Metadata; state: { isLoaded: boolean } };
};

type TagsFilter = {
    [tagCategory: string]: {
        [tagKey: string]: boolean;
    };

    Custom?: {
        Recent?: boolean;
    };
};

type BookTags = {
    [tagCategory: string]: { [tag: string]: number };
};

export type BooksStore = { books: Books; searchTerm: string; tagsFilter: TagsFilter };

const initBooksStore = (initStore: BooksStore = { books: {}, searchTerm: "", tagsFilter: {} }) => {
    const bookStore = observable<BooksStore>(initStore);
    autorun(
        () => {
            console.log("[Update]: booksStore");
            if (isDev()) {
                const store = toJS(booksStore);
                const booksWithoutCover: Books = Object.fromEntries(
                    Object.entries(toJS(store.books)).map(([key, value]) => [
                        key,
                        { ...value, metadata: { ...value.metadata, cover: "" } },
                    ])
                );
                window["booksStore"] = { ...store, books: booksWithoutCover };
            }
        },
        { delay: 200 }
    );
    return bookStore;
};

export let booksStore = initBooksStore();

export const filteredBooksCompute = computed(() => {
    const activeFilterTags = activeFilterTagsCompute.get();
    const hasActiveFilterTags = !!Object.keys(activeFilterTags).length;

    if (!booksStore.searchTerm && !hasActiveFilterTags) return booksStore.books;

    let bookEntries = Object.entries(booksStore.books);

    if (booksStore.searchTerm) {
        const options = {
            keys: [
                {
                    name: "title",
                    getFn: (bookEntry: ArrayElement<Entries<Books>>) => bookEntry[1].metadata.title,
                },
                {
                    name: "author",
                    getFn: (bookEntry: ArrayElement<Entries<Books>>) =>
                        bookEntry[1].metadata.author,
                },
            ],
        };
        const fuse = new Fuse(bookEntries, options);

        const searchFilteredBookEntries = fuse
            .search(booksStore.searchTerm)
            .map((result) => result.item);

        bookEntries = searchFilteredBookEntries;
    }

    if (hasActiveFilterTags) {
        bookEntries = bookEntries.filter(([bookKey, bookValue]) =>
            Object.entries(activeFilterTags).every(([tagCategory, tags]) => {
                const tagKeys = Object.keys(tags);

                if (tagCategory === "Genres") {
                    const bookSubjects = bookValue.metadata.subjects;
                    return _.every(bookSubjects, (item) => _.includes(tagKeys, item));
                } else if (tagCategory === "Year") {
                    const bookYear = getMetadataYear(bookValue.metadata);
                    return tagKeys.includes(bookYear);
                }
                return new Array(Object.keys(activeFilterTags).length).fill(true);
            })
        );
    }

    return Object.fromEntries(bookEntries);
});

export const setSearchTerm = action((searchTerm: string) =>
    set(booksStore, "searchTerm", searchTerm)
);

export const activeFilterTagsCompute = computed<TagsFilter>(() => {
    const activeTags = Object.fromEntries(
        Object.entries(booksStore.tagsFilter)
            .map(([tagCategory, tags]) => [
                tagCategory,
                Object.fromEntries(Object.entries(tags).filter(([tagKey, isActive]) => isActive)),
            ])
            .filter(([tagCategory, tags]) => Object.keys(tags).length)
    );

    return activeTags;
});

export const setFilterTag = action((tagCategory: string, tagKey: string, value: boolean) => {
    let tagsFilter = { ...booksStore.tagsFilter };

    if (!(tagCategory in booksStore.tagsFilter)) tagsFilter[tagCategory] = {};
    if (tagCategory === "Custom" && tagKey === "Recent" && value)
        tagsFilter = { Custom: booksStore.tagsFilter.Custom ?? {} };

    tagsFilter[tagCategory][tagKey] = value;

    set(booksStore, "tagsFilter", tagsFilter);
});

export const resetFilterTags = action(() => {
    set(booksStore, "tagsFilter", {});
});

const tagCategoryCounter = (
    tagsGetter: (metadata: Metadata) => string[],
    books: Books = booksStore.books
) => {
    const tagsObj: { [key: string]: number } = {};

    Object.values(books).forEach((bookValue) => {
        const tags = tagsGetter(bookValue.metadata);

        tags.forEach((tag: string) => {
            if (!(tag in tagsObj)) tagsObj[tag] = 1;
            else tagsObj[tag] += 1;
        });
    });

    return tagsObj;
};

export const bookTagsCompute = computed<BookTags>((books: Books = booksStore.books) => {
    const subjects = tagCategoryCounter((m) => m.subjects);
    const year = tagCategoryCounter((m) => [getMetadataYear(m)]);

    return {
        subjects,
        year,
    };
});

export const addBooks = action((bookKeys: string[]) => {
    const addedInitBooks = bookKeys.map((bookKey) => [
        bookKey,
        { metadata: initBookMetadata, state: { isLoaded: false } },
    ]);

    const updatedBooks = Object.fromEntries([
        ...Object.entries(booksStore.books),
        ...addedInitBooks,
    ]);

    set(booksStore, "books", updatedBooks);
    processInitBooks(bookKeys);
});

const processInitBooks = async (initBookKeys: string[]) => {
    const metadataEntries: [string, Metadata][] = await context.getMetadata(initBookKeys);

    const addedBooks: Entries<Books> = metadataEntries.map(([bookKey, metadata]) => [
        bookKey,
        { metadata, state: { isLoaded: true } },
    ]);

    const updatedBooks = Object.fromEntries([...Object.entries(booksStore.books), ...addedBooks]);
    // https://stackoverflow.com/a/64771774/10744339
    runInAction(() => {
        set(booksStore, "books", updatedBooks);
    });
};

export const removeBooks = action((bookKeys: string[]) =>
    set(booksStore, "books", _.omit(booksStore.books, bookKeys))
);
