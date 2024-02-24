import { action, observable, autorun, set, toJS } from "mobx";
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

type Books = {
    [key: string]: { metadata: Metadata; state: { isLoaded: boolean } };
};

let booksStore = observable<{ data: Books; searchTerm: "" }>({ data: {}, searchTerm: "" });
let isInitialized = false;

export const getSearchTerm = () => booksStore.searchTerm;
export const setSearchTerm = action((searchTerm: string) =>
    set(booksStore, "searchTerm", searchTerm)
);

const ensureBookInit = (initBooks: Books = {}) => {
    if (!isInitialized) {
        setBooks(initBooks);
        isInitialized = true;

        autorun(
            () => {
                console.log("[Update]: booksStore");
                if (isDev()) {
                    const store = toJS(booksStore);
                    const booksWithoutCover: Books = Object.fromEntries(
                        Object.entries(toJS(store.data)).map(([key, value]) => [
                            key,
                            { ...value, metadata: { ...value.metadata, cover: "" } },
                        ])
                    );
                    window["booksStore"] = { ...store, data: booksWithoutCover };
                }
            },
            { delay: 200 }
        );
    }
};

export const getBooks = (searchTerm: string = booksStore.searchTerm) => {
    ensureBookInit();

    if (!searchTerm) return booksStore.data;

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

    const fuse = new Fuse(Object.entries(booksStore.data), options);

    return Object.fromEntries(fuse.search(searchTerm).map((result) => result.item));
};

export const getTags = () => {
    const books = getBooks(null);

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
};

export const setBooks = action((books: Books) => set(booksStore, "data", books));

export const addBooks = action((bookKeys: string[]) => {
    const addedInitBooks = bookKeys.map((bookKey) => [
        bookKey,
        { metadata: initBookMetadata, state: { isLoaded: false } },
    ]);

    const updatedBooks = Object.fromEntries([...Object.entries(getBooks(null)), ...addedInitBooks]);
    set(booksStore, "data", updatedBooks);

    processInitBooks(bookKeys);
});

const processInitBooks = async (initBookKeys: string[]) => {
    const metadataEntries: [string, Metadata][] = await context.getMetadata(initBookKeys);

    const addedBooks: Entries<Books> = metadataEntries.map(([bookKey, metadata]) => [
        bookKey,
        { metadata, state: { isLoaded: true } },
    ]);

    const updatedBooks = Object.fromEntries([...Object.entries(getBooks(null)), ...addedBooks]);
    set(booksStore, "data", updatedBooks);
};

export const removeBooks = action((bookKeys: string[]) =>
    set(booksStore, "data", _.omit(getBooks(null), bookKeys))
);
