import _ from "lodash";
import { makeAutoObservable, observable, runInAction, toJS } from "mobx";

import type BookWebComponent from "~/renderer/scenes/Reading/scenes/BookWebComponent";
import type { TocState } from "~/renderer/scenes/Reading/scenes/BookWebComponent";
import { BookKey } from "../BookStore";
import { RootStore } from "../RootStore";

export interface BookInteractionState {
    bookmarks: {
        auto: Bookmark;
        manual: Bookmark[];
    };
}

type BookmarkTypes = keyof BookInteractionState["bookmarks"];
export interface Bookmark {
    elementIndex: number | null;
    elementSection: number;
}

type TtsTarget = {
    startElement: ParentNode | null;
    startElementSelectedText: string | null;
};

export class BookReadStore {
    rootStore: RootStore;
    bookComponent: BookWebComponent | null = null;
    private bookKey: BookKey | null = null;
    tocState: TocState = {
        currentSectionName: null,
        currentSection: null,
        currentSectionTitle: null,
        sectionNames: null,
    };
    uiState: UiState = {
        currentSectionTitle: "",
        currentSectionPage: 0,
        totalSectionPages: 0,
        currentBookPage: 0,
        totalBookPages: 0,
    };

    ttsTarget: TtsTarget = {
        startElement: null,
        startElementSelectedText: null,
    };
    bookmarkablePositions: Bookmark[] = [];

    /**
     * User interaction state records
     */
    interactionRecords = new Map<BookKey, BookInteractionState>();

    constructor(rootStore: RootStore) {
        makeAutoObservable(
            this,
            { rootStore: false, bookComponent: observable.ref },
            { autoBind: true }
        );
        this.rootStore = rootStore;
    }

    setTocState(tocState: TocState) {
        this.tocState = tocState;
    }

    setUiState(uiState: UiState) {
        this.uiState = uiState;
    }
    resetUiState() {
        this.uiState = {
            currentSectionTitle: "",
            currentSectionPage: 0,
            totalSectionPages: 0,
            currentBookPage: 0,
            totalBookPages: 0,
        };
    }

    setTtsTarget(ttsTarget: TtsTarget) {
        this.ttsTarget = ttsTarget;
    }
    resetTtsTarget() {
        this.ttsTarget = {
            startElement: null,
            startElementSelectedText: null,
        };
    }

    get toc() {
        return this.rootStore.bookStore.getBookContent(this.bookKey).structure;
    }

    private getBookInteraction(bookKey: BookKey): BookInteractionState {
        const interactionState = this.interactionRecords.get(bookKey);
        if (!interactionState) {
            const defaultInteractionState: BookInteractionState = {
                bookmarks: {
                    auto: { elementSection: 0, elementIndex: 0 },
                    manual: [],
                },
            };

            runInAction(() => this.setBookInteraction(bookKey, defaultInteractionState));

            return this.getBookInteraction(bookKey);
        }

        return interactionState;
    }
    private setBookInteraction(bookKey: BookKey, interactionState: BookInteractionState) {
        this.interactionRecords.set(bookKey, interactionState);
    }
    private addBookInteractionBookmark(bookKey: BookKey, bookmark: Bookmark, type: BookmarkTypes) {
        const interactionState = this.getBookInteraction(bookKey);

        if (type === "auto") interactionState.bookmarks[type] = bookmark;
        if (type === "manual") {
            // Ensures all bookmark objects have unique values
            interactionState.bookmarks[type] = _.uniqWith(
                [...interactionState.bookmarks[type], bookmark],
                _.isEqual
            );
        }
    }
    private removeBookInteractionBookmark(bookKey: BookKey, targetBookmark: Bookmark) {
        const interactionState = this.getBookInteraction(bookKey);
        _.remove(interactionState.bookmarks["manual"], (bookmark) =>
            _.isEqual(bookmark, targetBookmark)
        );
    }

    load() {
        const { elementIndex } = this.autobookmark;
        const { sectionNames } = this.contentState;

        this.bookComponent.loadBook(
            this.content,
            toJS(this.metadata),
            this.initSectionIndex,
            sectionNames,
            { elementIndex }
        );
    }
    unload() {
        console.log("unload");
        this.setBookComponent(null);
        this.setBook(null);
        this.resetTtsTarget();
        this.resetUiState();
        this.setBookmarkablePositions([]);
    }

    get book() {
        return this.bookKey;
    }

    setBook(bookKey: BookKey) {
        if (bookKey === this.bookKey) return;

        this.bookKey = bookKey;
        if (this.bookKey) this.requestContent();
    }

    requestContent() {
        this.rootStore.bookStore.openBook(this.bookKey, this.initSectionIndex);
    }

    setBookComponent(bookComponent: BookWebComponent) {
        this.bookComponent = bookComponent;
    }

    get metadata() {
        return this.rootStore.bookStore.getBookMetadata(this.bookKey, true);
    }

    get content() {
        return this.rootStore.bookStore.getBookContent(this.bookKey);
    }

    get contentState() {
        return this.rootStore.bookStore.getBookContentState(this.bookKey);
    }

    get isReady() {
        return Boolean(this.bookKey && this.isBookComponentReady && this.isInitSectionReady);
    }

    get isBookComponentReady() {
        return Boolean(this.bookComponent);
    }

    get isInitSectionReady() {
        return this.rootStore.bookStore.getBookContentState(this.bookKey).isInitSectionParsed;
    }

    get autobookmark() {
        return this.getBookInteraction(this.bookKey).bookmarks.auto;
    }

    get initSectionIndex() {
        const initSectionIndex = this.autobookmark.elementSection;
        return initSectionIndex;
    }

    setAutobookmark(bookmark: Bookmark) {
        return this.addBookInteractionBookmark(this.bookKey, bookmark, "auto");
    }

    addManualBookmark() {
        this.addBookInteractionBookmark(this.bookKey, this.autobookmark, "manual");
    }
    removeManualBookmark() {
        this.currentManualBookmarks.forEach((bookmark) =>
            this.removeBookInteractionBookmark(this.bookKey, bookmark)
        );
    }

    setBookmarkablePositions(bookmarkablePositions: Bookmark[]) {
        this.bookmarkablePositions = bookmarkablePositions;
    }

    /**
     * Returns all manual bookmarks on current page
     */
    get currentManualBookmarks(): Bookmark[] {
        const interactionState = this.getBookInteraction(this.bookKey);
        const { manual } = interactionState.bookmarks;

        const currentManuakBookmarks = _.intersectionWith(
            manual,
            this.bookmarkablePositions,
            _.isEqual
        );
        return currentManuakBookmarks;
    }

    get isManualBookmarked() {
        return Boolean(this.currentManualBookmarks.length);
    }
}
