import { action, observable, autorun, set, toJS, computed, runInAction } from "mobx";
import _ from "lodash";

import { isDev } from "~/common/helpers";
import { booksStore, type BookMetadata } from "./books";
import context from "../ipc";

declare global {
    interface Window {
        openedBooksStore?: typeof openedBooksStore;
    }
}
export type OpenedBook = {
    state: {
        metadataParsed: boolean;
        initSectionParsed: boolean;
        sectionsParsed?: number[];
    };
    metadata: BookMetadata;

    styles?: any;
    structure?: any;
    sectionNames?: string[];
    sections?: any[];
};

export type OpenedBooks = {
    [bookKey: string]: OpenedBook;
};

export type OpenedBooksStore = { books: OpenedBooks };

const initOpenedBooksStore = (initStore: OpenedBooksStore = { books: {} }) => {
    const openedBooksStore = observable<OpenedBooksStore>(initStore);
    autorun(
        () => {
            console.log("[Update]: openedBooksStore");
            if (isDev()) {
                // const store = toJS(openedBooksStore);
                // window["openedBooksStore"] = store;
            }
        },
        { delay: 200 }
    );
    return openedBooksStore;
};

export let openedBooksStore = initOpenedBooksStore();

export const openBook = action((bookKey: string) => {
    const isBookPresentInStorage = bookKey in booksStore.books;
    const isBookOpened = bookKey in openedBooksStore.books;

    console.log(
        "bookKey",
        bookKey,
        "isBookPresentInStorage",
        isBookPresentInStorage,
        "isBookOpened",
        isBookOpened
    );
    if (!isBookPresentInStorage || isBookOpened) return;

    const initOpenedBook: OpenedBook = {
        ...booksStore.books[bookKey],
        state: { ...booksStore.books[bookKey].state, initSectionParsed: false },
    };

    const updatedOpenedBooks = { ...openedBooksStore.books, [bookKey]: initOpenedBook };

    set(openedBooksStore, "books", updatedOpenedBooks);
    processInitBook(bookKey);
});

const processInitBook = async (initBookKey: string) => {
    const parsedBook: Required<Omit<OpenedBook, "state">> = await context.getParsedContents(
        initBookKey
    );
    console.log("parsedBook", parsedBook);

    // TODO perfomance issues
    // - when the book from contentsParsingProcess is received
    // - when runInAction is called
    // TODO make only state reactive with mobx, and leave everything else plain

    const updatedBooks = {
        ...openedBooksStore.books,
        [initBookKey]: {
            ...parsedBook,
            state: {
                metadataParsed: true,
                initSectionParsed: true,
                sectionsParsed: parsedBook.sections
                    .map((item, index) => (item.contents !== undefined ? index : undefined))
                    .filter((item) => item),
            },
        },
    };

    // ref: https://stackoverflow.com/a/64771774/10744339
    runInAction(() => {
        set(openedBooksStore, "books", updatedBooks);
    });
};
