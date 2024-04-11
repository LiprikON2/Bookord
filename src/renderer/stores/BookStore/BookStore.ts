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
    initSectionIndex: number | null;
    parsedSections: number[];
    sectionNames: string[];
};

export type BookMetadata = {
    title: string | object | null;
    description: string;
    date: string;
    cover: string;
    author: string | object | null;
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

export type Structure = {
    name: string;
    path: string;
    playOrder: string;
    sectionId: string;
    nodeId?: string;
    children: Structure[];
};

export type BookContent = {
    styles: object[];
    structure: Structure[];
    sections: { id: string; content: object[] | null }[];
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

export type BookStateInStorageWithMetadata = BookStateInStorage & {
    visible: boolean;
    metadata: BookMetadata | null;
};

export type BookStateOpened = BookStoreState & {
    bookKey: BookKey;
    title: BookKey | string;
};

/* TODO move:

store/hooks
store/ipc

and

fix BookCard context import

*/

// TODO Do metadata fallbacks in `setBookMetadata`
const provideFallbackTitle = (filename: string, title?: any): string => {
    if (typeof title === "object" && "_" in title) return title?._ ?? filename;
    if (typeof title === "string" && title) return title;
    return filename;
};

// TODO use root store
// https://mobx.js.org/defining-data-stores.html#combining-multiple-stores

/**
 * Domain store
 *
 * ref: https://mobx.js.org/defining-data-stores.html#domain-stores
 */
export class BookStore {
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

    getBookContent(bookKey: BookKey) {
        const content = this.contentRecords.get(bookKey) ?? {
            styles: [],
            structure: [],
            sections: [],
        };

        return content;
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
            initSectionIndex: null,
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
        const contentState = this.contentStateRecords.get(bookKey) ?? {
            isInitSectionParsed: false,
            isFullyParsed: false,
            initSectionIndex: null,
            parsedSections: [],
            sectionNames: [],
        };
        return contentState;
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
            visible: true,
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
            title: provideFallbackTitle(bookKey, this.getBookMetadata(bookKey)?.title),
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

    getContentStateFromContent(content: BookContent, initSectionIndex: number): BookContentState {
        const parsedSections = content.sections
            .map((section, index) => (section.content !== null ? index : null))
            .filter((item) => item !== null);
        const isInitSectionParsed = !!parsedSections.length;
        const isFullyParsed = parsedSections.length === content.sections.length;
        const sectionNames = content.sections.map((section) => section.id);

        // console.log("update", parsedSections.length, content.sections.length, parsedSections);
        return {
            isInitSectionParsed,
            isFullyParsed,
            initSectionIndex,
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
        this.removeBookStoreState(bookKey);

        // Allows for animating components out with the cover of the book intact
        setInterval(() => this.removeBookMetadata(bookKey), 200);
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
        // TODO add types
        //
        // TODO probably triggers:
        // (node:7320) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 message listeners
        // added to [ForkUtilityProcess]. Use emitter.setMaxListeners() to increase limit
        const unsub = window.electron_window.events("parsed-content-init", (initEvent) => {
            if (initEvent.bookKey !== bookKey) return;

            this.setBookContent(bookKey, initEvent.initContent);

            const initContentState = this.getContentStateFromContent(
                initEvent.initContent,
                initSectionIndex
            );
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

                    const updatedContentState = this.getContentStateFromContent(
                        content,
                        initSectionIndex
                    );
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
