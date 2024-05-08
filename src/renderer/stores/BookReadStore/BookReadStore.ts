import _ from "lodash";
import { makeAutoObservable, observable, runInAction, toJS } from "mobx";

import type BookWebComponent from "~/renderer/scenes/Reading/scenes/BookWebComponent";
import type { TocState } from "~/renderer/scenes/Reading/scenes/BookWebComponent";
import { BookKey } from "../BookStore";
import { RootStore } from "../RootStore";

interface TimeRecord {
    activeDuration: number;
    idleDuration: number;
    endDate: Date;
    endBookmark: Bookmark;
    progress: number;
    // durations: {
    //     isIdle: boolean;
    //     duration: number;
    // }[];
}

export interface BookInteractionState {
    bookmarks: {
        auto: Bookmark;
        manual: Bookmark[];
    };
    reading: TimeRecord[];
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

    private addBookInteractionTimeRecord(bookKey: BookKey, timeRecord: TimeRecord) {
        const interactionState = this.getBookInteraction(bookKey);
        interactionState.reading.push(timeRecord);
    }

    getBookInteraction(bookKey: BookKey): BookInteractionState {
        const interactionState = this.interactionRecords.get(bookKey);
        if (!interactionState) {
            const defaultInteractionState: BookInteractionState = {
                bookmarks: {
                    auto: { elementSection: 0, elementIndex: 0 },
                    manual: [],
                },
                reading: [],
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

    getSectionTitle(sectionIndex: number, toc = this.toc, root = true): string {
        const { sectionNames } = this.contentState;

        let descendantSectionTitle;
        for (const tocEntry of toc) {
            const tocEntryChildren = tocEntry?.children;
            if (tocEntryChildren) {
                descendantSectionTitle = this.getSectionTitle(
                    sectionIndex,
                    tocEntryChildren,
                    false
                );
                if (descendantSectionTitle) break;
            }
        }

        const tocEntry = toc.find((tocEntry) => tocEntry.sectionId === sectionNames[sectionIndex]);
        const sectionTitle = tocEntry?.name;

        if (descendantSectionTitle) {
            // Use the deep-nested title if possible
            return descendantSectionTitle;
        } else if (sectionTitle) {
            return sectionTitle;
        } else if (root && sectionIndex >= 0 && sectionIndex < sectionNames.length) {
            // Untitled sections try to use previous section's title
            const prevSectionTitle = this.getSectionTitle(sectionIndex - 1, toc);
            return prevSectionTitle;
        } else {
            return "Unknown chapter";
        }
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

    get manualBookmarks() {
        const interactionState = this.getBookInteraction(this.bookKey);
        return interactionState.bookmarks.manual;
    }

    get bookmarks() {
        if (!this.contentState.isInitSectionParsed) return [];

        const currentManualBookmarks = this.currentManualBookmarks;
        return this.manualBookmarks
            .map((manualBookmark) => ({
                ...manualBookmark,
                sectionId: this.contentState.sectionNames[manualBookmark.elementSection],
                label: this.getSectionTitle(manualBookmark.elementSection),
                active: _.some(currentManualBookmarks, (currentManualBookmark) =>
                    _.isEqual(currentManualBookmark, manualBookmark)
                ),
            }))
            .toSorted(
                (a, b) => a.elementSection - b.elementSection || a.elementIndex - b.elementIndex
            );
    }

    /**
     * Returns all manual bookmarks on current page
     */
    get currentManualBookmarks(): Bookmark[] {
        const manual = this.manualBookmarks;

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

    // TODO not very accurate as it assumes every section has the same number of pages
    get currentProgress() {
        if (!this.contentState.isFullyParsed) return null;

        const { elementSection } = this.autobookmark;
        const { currentSectionPage, totalSectionPages } = this.uiState;
        const sectionRatio = 1 / this.contentState.sectionNames.length;
        const sectionPageRatio = 1 / totalSectionPages;
        const progress =
            sectionRatio * elementSection + sectionRatio * (sectionPageRatio * currentSectionPage);

        return progress;
    }

    getLastKnownProgress(bookKey: BookKey) {
        const interaction = this.getBookInteraction(bookKey);
        const timeRecord = interaction.reading.findLast(
            (timeRecord) => timeRecord.progress !== null
        );
        return timeRecord?.progress ?? null;
    }

    addTimeRecord(timeRecord: TimeRecord) {
        this.addBookInteractionTimeRecord(this.bookKey, timeRecord);
    }

    getActiveDuration(bookKey: BookKey) {
        const interaction = this.getBookInteraction(bookKey);
        return interaction.reading.reduce((acc, cur) => acc + cur.activeDuration, 0);
    }
}
