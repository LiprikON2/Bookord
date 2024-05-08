import {
    autorun,
    getDependencyTree,
    makeAutoObservable,
    reaction,
    runInAction,
    toJS,
    trace,
    when,
} from "mobx";
import _ from "lodash";

import context from "./ipc";
import sampleCover from "~/assets/images/sampleBookCover.webp";
import { RootStore } from "../RootStore";
import { RaceConditionGuard } from "./utils";

export type BookState = {
    isInStorage: boolean;
    isContentRequested: boolean;
    isMetadataParsed: boolean;
};
export type BookStoreState = {
    /** Wether or not watcher has given infomation about presense of file in the storage folder */
    isInStorage: boolean;
    /** Wether or not a request to parse contents of the file was made to a child process  */
    isContentRequested: boolean;
};

export type BookContentState = {
    isInitSectionParsed: boolean;
    isFullyParsed: boolean;
    initSectionIndex: number | null;
    parsedSections: number[];
    sectionNames: string[];
};

export type BookMetadataRaw = {
    title: string | object | null;
    cover: string | object | null;
    author: string | object | null;
    description: string;
    date: string;
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

export type BookMetadata = {
    title: string;
    description: string;
    date: Date | null;
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

export type Structure = {
    name: string;
    path: string;
    playOrder: string;
    sectionId: string;
    nodeId?: string;
    children: Structure[];
};

export interface SectionContent {
    children: {
        tag: string;
        attrs?: {
            href?: string;
            alt?: string;
            class?: string;
            hidden?: any;
            id?: string;
            style?: string;
            title?: string;
        };
        children: { text?: string; type: number }[];
    }[];
}

export interface BookStyles {
    comment: string | null;
    date: Date;
    dir: boolean;
    dosPermissions: null;
    options: any;
    unixPermissions: number;

    href: string | null;
    /**
     * Raw CSS code string
     */
    _data?: string;
    _initialMetadata?: {
        date: Date;
        dir: boolean;
    };
}

export type BookContent = {
    styles: BookStyles[];
    structure: Structure[];
    sections: {
        id: string;
        content: SectionContent[] | null;
    }[];
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

const provideFallbackDate = (date?: any): string => {
    if (typeof date === "object") {
        if ("_" in date && typeof date?._ === "string") {
            return date._;
        } else return "Unknown";
    } else if (typeof date === "string" && date) return date;
    return date;
};

const provideFallbackCover = (cover?: any): string => {
    if (!cover || cover === "unkown") return sampleCover;
    return cover;
};

const provideFallbackTitle = (filename: string, title?: any): string => {
    if (typeof title === "object" && "_" in title) return title?._ ?? filename;
    if (typeof title === "string" && title) return title;
    return filename;
};

const provideFallbackAuthors = (authors?: any): string => {
    if (typeof authors === "object") {
        if ("_" in authors && typeof authors?._ === "string") {
            return authors._;
        } else return "Unknown";
    } else if (typeof authors === "string" && authors) return authors;
    return authors;
};

interface FileMetadata {
    addedDate: Date;
    // openedDates: Date[] | null;
}

/**
 * Domain store
 *
 * ref: https://mobx.js.org/defining-data-stores.html#domain-stores
 */
export class BookStore {
    raceConditionGuard = new RaceConditionGuard();
    rootStore: RootStore;

    // ref: https://www.zhenghao.io/posts/object-vs-map
    storeStateRecords = new Map<BookKey, BookStoreState>();

    bookMetadataRecords = new Map<BookKey, BookMetadata>();
    fileMetadataRecords = new Map<BookKey, FileMetadata>();

    contentRecords = new Map<BookKey, BookContent>();
    contentStateRecords = new Map<BookKey, BookContentState>();

    // TODO split:
    //
    // fileMetadataRecords = new Map<BookKey, BookMetadata>();
    // apiMetadataRecords = new Map<BookKey, any>();

    constructor(rootStore: RootStore) {
        makeAutoObservable(this, {
            contentRecords: false,
            rootStore: false,
            raceConditionGuard: false,
        });
        this.rootStore = rootStore;
    }

    getFileMetadata(bookKey: BookKey) {
        const metadata = this.fileMetadataRecords.get(bookKey);
        return metadata;
    }

    initFileMetadata(bookKey: BookKey) {
        const initMetadata: FileMetadata = {
            addedDate: new Date(),
        };

        this.setFileMetadata(bookKey, initMetadata);
    }

    setFileMetadata(bookKey: BookKey, metadata: FileMetadata) {
        this.fileMetadataRecords.set(bookKey, metadata);
    }

    removeFileMetadata(bookKey: BookKey) {
        this.fileMetadataRecords.delete(bookKey);
    }

    getBookMetadata(bookKey: BookKey, fallbacks = false) {
        const metadata = this.bookMetadataRecords.get(bookKey);
        if (!fallbacks) return metadata;

        const fallbackedMetadata: BookMetadata = {
            description: "",
            indentifiers: [],
            languages: [],
            relations: [],
            subjects: [],
            publishers: [],
            contributors: [],
            coverages: [],
            rights: [],
            sources: [],
            ...metadata,
            date: new Date(provideFallbackDate(metadata?.date)),
            cover: provideFallbackCover(metadata?.cover),
            title: provideFallbackTitle(bookKey, metadata?.title),
            author: provideFallbackAuthors(metadata?.author),
        };
        return fallbackedMetadata;
    }
    setBookMetadata(
        bookKey: BookKey,
        metadata: BookMetadata | BookMetadataRaw,
        callback = () => this.rootStore.bookViewStore.updateTags()
    ) {
        const fallbackedMetadata: BookMetadata = {
            ...metadata,
            date: new Date(provideFallbackDate(metadata?.date)),
            cover: provideFallbackCover(metadata.cover),
            title: provideFallbackTitle(bookKey, metadata.title),
            author: provideFallbackAuthors(metadata.author),
        };

        this.bookMetadataRecords.set(bookKey, fallbackedMetadata);
        this.initFileMetadata(bookKey);
        callback?.();
    }
    removeBookMetadata(
        bookKey: BookKey,
        callback = () => this.rootStore.bookViewStore.updateTags()
    ) {
        this.bookMetadataRecords.delete(bookKey);
        callback?.();
    }

    getBookContent(bookKey: BookKey): BookContent {
        const content = this.contentRecords.get(bookKey);
        if (!content) {
            const defaultContent: BookContent = {
                styles: [],
                structure: [],
                sections: [],
            };

            runInAction(() => this.setBookContent(bookKey, defaultContent));

            return this.getBookContent(bookKey);
        }

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
                isContentRequested: !!storageState?.isContentRequested,
                isInStorage: true,
            });
        });

        const metadataEntries = await context.getParsedMetadata(bookKeys);

        runInAction(() => {
            metadataEntries.forEach(([bookKey, metadata]) =>
                this.setBookMetadata(bookKey, metadata, null)
            );
            this.rootStore.bookViewStore.updateTags();
        });
    }

    removeBook(bookKey: BookKey, delayedBy = 200) {
        this.removeBookContent(bookKey);
        this.removeBookStoreState(bookKey);

        // Allows for animating components out with the cover of the book intact
        if (delayedBy) setTimeout(() => this.removeBookMetadata(bookKey), delayedBy);
        else this.removeBookMetadata(bookKey);
    }
    removeBooks(bookKeys: BookKey[]) {
        bookKeys.forEach((bookKey) => this.removeBook(bookKey));
    }

    updateBooks(storageBooks: BookKey[]) {
        const storeBooks = this.getBookKeysInStorage();
        const addedBooks = _.difference(storageBooks, storeBooks);
        const removedBooks = _.difference(storeBooks, storageBooks);

        if (addedBooks.length || removedBooks.length) {
            if (addedBooks.length) runInAction(() => this.addBooks(addedBooks));
            if (removedBooks.length) runInAction(() => this.removeBooks(removedBooks));
        }
    }

    async openBook(bookKey: BookKey, initSectionIndex: number = 0) {
        let state = this.getBookState(bookKey);

        if (state.isContentRequested) return;
        if (!state.isInStorage) {
            // Ensures there is only one promise at a time
            await this.raceConditionGuard.getGuardedPromise(
                when(() => this.getBookState(bookKey).isInStorage)
            );
            state = this.getBookState(bookKey);
        }

        runInAction(() => {
            this.setBookStoreState(bookKey, {
                isInStorage: state.isInStorage,
                isContentRequested: true,
            });
        });

        runInAction(() => {
            context.getParsedContent(bookKey, initSectionIndex);
            // TODO triggers warning:
            // MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 message listeners
            // added to [ForkUtilityProcess]. Use emitter.setMaxListeners() to increase limit
            const unsub = context.handleParsedContentInit((initEvent) => {
                if (initEvent.bookKey !== bookKey) return;

                this.setBookContent(bookKey, initEvent.initContent);

                const initContentState = this.getContentStateFromContent(
                    initEvent.initContent,
                    initSectionIndex
                );
                runInAction(() => this.setBookContentState(bookKey, initContentState));

                const content = this.getBookContent(bookKey);
                const unsub2 = context.handleParsedContentSection((sectionContentEvent) => {
                    if (sectionContentEvent.bookKey !== bookKey) return;

                    this.setBookContentSection(
                        bookKey,
                        sectionContentEvent.sectionIndex,
                        sectionContentEvent.section
                    );

                    const updatedContentState = this.getContentStateFromContent(
                        content,
                        initSectionIndex
                    );
                    runInAction(() => this.setBookContentState(bookKey, updatedContentState));

                    if (updatedContentState.isFullyParsed) {
                        unsub();
                        unsub2();
                    }
                });
            });
        });
    }

    closeBook(bookKey: BookKey) {
        this.removeBookContent(bookKey);

        const storeState = this.getBookStoreState(bookKey);
        this.setBookStoreState(bookKey, {
            ...storeState,
            isContentRequested: false,
        });
    }
}
