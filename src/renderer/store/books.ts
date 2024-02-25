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

export type Metadata = typeof initBookMetadata;

export type Books = {
    [key: string]: { metadata: Metadata; state: { isLoaded: boolean } };
};

type TagsFilter = {
    [tagCategory: string]: {
        [tagKey: string]: boolean;
    };
};

type BookTags = {
    [tagCategory: string]: string[];
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
    if (!booksStore.searchTerm) return booksStore.books;

    const options = {
        keys: [
            {
                name: "title",
                getFn: (bookEntry: ArrayElement<Entries<Books>>) => bookEntry[1].metadata.title,
            },
            {
                name: "author",
                getFn: (bookEntry: ArrayElement<Entries<Books>>) => bookEntry[1].metadata.author,
            },
        ],
    };

    const fuse = new Fuse(Object.entries(booksStore.books), options);

    const activeFilterTags = activeFilterTagsCompute.get();

    const searchFilteredBooks = Object.fromEntries(
        fuse
            .search(booksStore.searchTerm)
            .map((result) => result.item)
            .filter(([bookKey, bookValue]) =>
                Object.entries(activeFilterTags).every(([tagCategory, tags]) => {
                    const tagKeys = Object.keys(tags);
                    if (tagCategory === "subjects") {
                        const bookSubjects = bookValue.metadata.subjects;
                        return _.every(bookSubjects, (item) => _.includes(tagKeys, item));
                    }
                })
            )
    );

    return searchFilteredBooks;
});

export const setSearchTerm = action((searchTerm: string) =>
    set(booksStore, "searchTerm", searchTerm)
);

export const activeFilterTagsCompute = computed(() => {
    const activeTags = Object.fromEntries(
        Object.entries(booksStore.tagsFilter).map(([tagCategory, tags]) => [
            tagCategory,
            Object.fromEntries(Object.entries(tags).filter(([tagKey, isActive]) => isActive)),
        ])
    );

    return activeTags;
});

export const setTag = action((tagCategory: string, tagKey: string, value: boolean) => {
    if (!(tagCategory in booksStore.tagsFilter)) booksStore.tagsFilter[tagCategory] = {};
    booksStore.tagsFilter[tagCategory][tagKey] = value;
});

export const tagsCompute = computed<BookTags>((books: Books = booksStore.books) => {
    const subjectsSet = new Set<string>([
        "This is a very long string about long things",
        "bunch",
        "of",
        "values",
        "here",
        "like",
        "alot",
        "them",
        "yes",
        "no",
    ]);
    Object.values(books).forEach((bookValue) => {
        bookValue.metadata.subjects.forEach((subject: string) => {
            subjectsSet.add(subject);
        });
    });

    const yearSet = new Set<string>();
    Object.values(books).forEach((bookValue) => {
        const year = new Date(bookValue.metadata.date).getFullYear();
        const yearString = Number.isNaN(year) ? "Unknown" : year.toString();
        yearSet.add(yearString);
    });

    return {
        subjects: [...subjectsSet],
        year: [...yearSet],
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
