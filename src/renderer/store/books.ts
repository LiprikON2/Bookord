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
    indentifiers: "",
    languages: "",
    relations: "",
    subjects: "",
    publishers: "",
    contributors: "",
    coverages: "",
    rights: "",
    sources: "",
    description: "",
    date: "",
    cover: "",
    author: "",
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
                if (isDev()) window["booksStore"] = toJS(booksStore);
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

    const addedBooks: any = metadataEntries.map(([bookKey, metadata]) => [
        bookKey,
        { metadata, state: { isLoaded: true } },
    ]);

    const updatedBooks = Object.fromEntries([...Object.entries(getBooks(null)), ...addedBooks]);
    set(booksStore, "data", updatedBooks);
};

export const removeBooks = action((bookKeys: string[]) =>
    set(booksStore, "data", _.omit(getBooks(null), bookKeys))
);
