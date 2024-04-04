import { makeAutoObservable } from "mobx";
import _ from "lodash";

import context from "./ipc";

export type BookState = {
    isInStorage: boolean;
    isContentRequested: boolean;
    isMetadataParsed: boolean;
};
export type BookContentState = {
    isInitSectionParsed: boolean;
    isFullyParsed: boolean;
    parsedSections: number[];
    sectionNames: string[];
};

export type BookMetadata = {
    title: string;
    description: string;
    date: string;
    cover: string;
    author: string;
    indentifiers: string[];
    languages: string[];
    relations: string[];
    subjects: string[];
    publishers: string[];
    contributors: string[];
    coverages: string[];
    rights: string[];
    sources: string[];
};

export type BookContent = {
    styles: object[];
    structure: object[];
    sections: { id: string; content: object | null }[];
};

export type BookStoreState = {
    /** Wether or not watcher has given infomation about presense of file in the storage folder */
    isInStorage: boolean;
    /** Wether or not a request to parse contents of the file was made to a child process  */
    isContentRequested: boolean;
    /**
     * When making a request to parse contents of the file to a child process,
     * specifies which section of file content should parsed first
     */
    requestedContentSection: number | null;
};

export type BookKey = string;

export type BookStateInStorage = BookState & {
    id: BookKey;
};

export type BookStateInStorageWithMetadata = BookStateInStorage & { metadata: BookMetadata | null };

export type BookStateOpened = BookStoreState & {
    bookKey: BookKey;
    title: BookKey | BookMetadata["title"];
};

/* TODO move:

store/hooks
store/ipc

and

fix BookCard context import

*/

/**
 * Domain store
 *
 * ref: https://mobx.js.org/defining-data-stores.html#domain-stores
 */
export class BookStore {
    // TODO default values
    //  new Map([[bookKey, value]])
    // ref: https://www.zhenghao.io/posts/object-vs-map
    storeStateRecords = new Map<BookKey, BookStoreState>();
    metadataRecords = new Map<BookKey, BookMetadata>();
    contentRecords = new Map<BookKey, BookContent>();
    contentStateRecords = new Map<BookKey, BookContentState>();

    // TODO consider using WeakMap

    // TODO add:
    // userContentRecords = new Map<BookKey, any>();
    //
    // fileMetadataRecords = new Map<BookKey, BookMetadata>();
    // apiMetadataRecords = new Map<BookKey, any>();

    constructor() {
        makeAutoObservable(this, { contentRecords: false });
    }

    getBookMetadata(bookKey: BookKey) {
        return this.metadataRecords.get(bookKey);
    }
    setBookMetadata(bookKey: BookKey, metadata: BookMetadata) {
        this.metadataRecords.set(bookKey, metadata);
    }
    removeBookMetadata(bookKey: BookKey) {
        this.metadataRecords.delete(bookKey);
    }
    getBookTags(bookKey: BookKey) {
        const metadata = this.getBookMetadata(bookKey);
    }

    getBookContent(bookKey: BookKey) {
        return this.contentRecords.get(bookKey);
    }
    setBookContent(bookKey: BookKey, content: BookContent) {
        this.contentRecords.set(bookKey, content);
    }
    setBookContentSection(
        bookKey: BookKey,
        sectionIndex: number,
        section: ArrayElement<BookContent["sections"]>
    ) {
        const content = this.getBookContent(bookKey);
        content.sections[sectionIndex].content = section.content;
    }
    removeBookContent(bookKey: BookKey) {
        this.contentRecords.delete(bookKey);
        this.setBookContentState(bookKey, {
            isInitSectionParsed: false,
            isFullyParsed: false,
            parsedSections: [],
            sectionNames: [],
        });
    }

    getBookStoreState(bookKey: BookKey) {
        return this.storeStateRecords.get(bookKey);
    }
    setBookStoreState(bookKey: BookKey, storeState: BookStoreState) {
        this.storeStateRecords.set(bookKey, storeState);
    }
    removeBookStoreState(bookKey: BookKey) {
        this.storeStateRecords.delete(bookKey);
    }

    getBookContentState(bookKey: BookKey) {
        return this.contentStateRecords.get(bookKey);
    }
    setBookContentState(bookKey: BookKey, contentState: BookContentState) {
        this.contentStateRecords.set(bookKey, contentState);
    }
    removeBookContentState(bookKey: BookKey) {
        this.contentStateRecords.delete(bookKey);
    }

    getBookKeysInStorage(): BookKey[] {
        return Array.from(this.storeStateRecords)
            .map(([bookKey, storeState]) => (storeState.isInStorage ? bookKey : null))
            .filter((item) => item);
    }

    getBookStateInStorage(): BookStateInStorage[] {
        return this.getBookKeysInStorage().map((bookKey) => ({
            ...this.getBookState(bookKey),
            id: bookKey,
        }));
    }
    getBookMetadataInStorage(): BookStateInStorageWithMetadata[] {
        return this.getBookStateInStorage().map((bookState) => ({
            ...bookState,
            metadata: bookState.isMetadataParsed ? this.getBookMetadata(bookState.id) : null,
        }));
    }

    getBookKeysContentRequested(): BookKey[] {
        return Array.from(this.storeStateRecords)
            .map(([bookKey, storeState]) => (storeState.isContentRequested ? bookKey : null))
            .filter((item) => item);
    }

    getBookStateOpened(): BookStateOpened[] {
        return this.getBookKeysContentRequested().map((bookKey) => ({
            ...this.getBookStoreState(bookKey),
            title: this.getBookMetadata(bookKey)?.title ?? bookKey,
            bookKey,
        }));
    }

    getBookState(bookKey: BookKey): BookState {
        const storeState = this.getBookStoreState(bookKey);
        const metadata = this.getBookMetadata(bookKey);

        const isInStorage = Boolean(storeState?.isInStorage);
        const isContentRequested = Boolean(storeState?.isContentRequested);
        const isMetadataParsed = Boolean(metadata);

        return {
            isInStorage,
            isContentRequested,
            isMetadataParsed,
        };
    }

    getContentStateFromContent(content?: BookContent): BookContentState {
        const parsedSections = content.sections
            .map((section, index) => (section.content !== null ? index : null))
            .filter((item) => item !== null);
        const isInitSectionParsed = !!parsedSections.length;
        const isFullyParsed = parsedSections.length === content.sections.length;
        const sectionNames = content.sections.map((section) => section.id);

        return {
            isInitSectionParsed,
            isFullyParsed,
            parsedSections,
            sectionNames,
        };
    }

    async addBooks(bookKeys: BookKey[]) {
        bookKeys.forEach((bookKey) => {
            const storageState = this.getBookStoreState(bookKey);

            this.setBookStoreState(bookKey, {
                requestedContentSection: storageState?.requestedContentSection ?? null,
                isContentRequested: !!storageState?.isContentRequested,
                isInStorage: true,
            });

            if (storageState && storageState.requestedContentSection !== null) {
                this.openBook(bookKey, storageState.requestedContentSection);
            }
        });

        const metadataEntries = await context.getParsedMetadata(bookKeys);

        // // ref: https://stackoverflow.com/a/64771774/10744339
        // runInAction(() => {
        metadataEntries.forEach(([bookKey, metadata]) => this.setBookMetadata(bookKey, metadata));
        // });
    }

    // removeBook(bookKey: BookKey, deleteRecords: boolean = true) {
    removeBook(bookKey: BookKey) {
        this.removeBookContent(bookKey);
        this.removeBookMetadata(bookKey);
        this.removeBookStoreState(bookKey);
    }
    removeBooks(bookKeys: BookKey[]) {
        bookKeys.forEach((bookKey) => this.removeBook(bookKey));
    }

    updateStore(storageBooks: BookKey[]) {
        const storeBooks = this.getBookKeysInStorage();
        const addedBooks = _.difference(storageBooks, storeBooks);
        const removedBooks = _.difference(storeBooks, storageBooks);

        if (addedBooks.length) this.addBooks(addedBooks);
        if (removedBooks.length) this.removeBooks(removedBooks);
    }

    openBook(bookKey: BookKey, initSectionIndex: number = 0) {
        const state = this.getBookState(bookKey);

        const shouldNotBeOpened = !state.isInStorage || state.isContentRequested;
        if (shouldNotBeOpened) {
            this.setBookStoreState(bookKey, {
                isInStorage: state.isInStorage,
                requestedContentSection: initSectionIndex,
                isContentRequested: state.isContentRequested,
            });

            return;
        }

        this.setBookStoreState(bookKey, {
            isInStorage: state.isInStorage,
            requestedContentSection: initSectionIndex,
            isContentRequested: true,
        });

        context.getParsedContent(bookKey, initSectionIndex);
        const unsub = window.electron_window.events("parsed-content-init", (initEvent) => {
            if (initEvent.bookKey !== bookKey) return;

            this.setBookContent(bookKey, initEvent.initContent);

            const initContentState = this.getContentStateFromContent(initEvent.initContent);
            this.setBookContentState(bookKey, initContentState);

            const content = this.getBookContent(bookKey);
            const unsub2 = window.electron_window.events(
                "parsed-content-section",
                (event: {
                    bookKey: BookKey;
                    sectionIndex: number;
                    section: ArrayElement<BookContent["sections"]>;
                }) => {
                    if (event.bookKey !== bookKey) return;

                    this.setBookContentSection(bookKey, event.sectionIndex, event.section);

                    const updatedContentState = this.getContentStateFromContent(content);
                    this.setBookContentState(bookKey, updatedContentState);

                    if (updatedContentState.isFullyParsed) {
                        unsub();
                        unsub2();
                    }
                }
            );
        });
    }

    closeBook(bookKey: BookKey) {
        this.removeBookContent(bookKey);

        const storeState = this.getBookStoreState(bookKey);
        this.setBookStoreState(bookKey, {
            ...storeState,
            isContentRequested: false,
            requestedContentSection: null,
        });
    }
}