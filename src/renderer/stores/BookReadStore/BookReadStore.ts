import _ from "lodash";
import { makeAutoObservable, observable, runInAction, toJS, when } from "mobx";

import type BookWebComponent from "~/renderer/scenes/Reading/scenes/BookWebComponent";
import type { TocState } from "~/renderer/scenes/Reading/scenes/BookWebComponent";
import { BookKey, TimeRecord } from "../BookStore";
import { RootStore } from "../RootStore";

export interface Bookmark {
    elementIndex: number | null;
    elementSection: number;
}

type TtsTarget = {
    startElement: ParentNode | null;
    startElementSelectedText: string | null;
};

const defaultUiState = {
    currentSectionTitle: "",
    currentSectionPage: 0,
    totalSectionPages: 0,
    currentBookPage: 0,
    totalBookPages: 0,
    nextPage: false,
    prevPage: false,
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
    uiState: UiState = defaultUiState;

    ttsTarget: TtsTarget = {
        startElement: null,
        startElementSelectedText: null,
    };
    bookmarkablePositions: Bookmark[] = [];

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
        this.uiState = defaultUiState;
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

    async requestContent() {
        await when(() => this.rootStore.bookStore.isReady);
        runInAction(() => this.rootStore.bookStore.openBook(this.bookKey, this.initSectionIndex));
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
        return Boolean(
            this.bookKey &&
                this.rootStore.bookStore.isReady &&
                this.isBookComponentReady &&
                this.isInitSectionReady
        );
    }

    get isBookComponentReady() {
        return Boolean(this.bookComponent);
    }

    get isInitSectionReady() {
        return this.rootStore.bookStore.getBookContentState(this.bookKey).isInitSectionParsed;
    }

    get autobookmark() {
        return this.rootStore.bookStore.getBookInteraction(this.bookKey).bookmarks.auto;
    }

    get initSectionIndex() {
        const initSectionIndex = this.autobookmark.elementSection;
        return initSectionIndex;
    }

    setAutobookmark(bookmark: Bookmark) {
        return this.rootStore.bookStore.addBookInteractionBookmark(this.bookKey, bookmark, "auto");
    }

    addManualBookmark() {
        this.rootStore.bookStore.addBookInteractionBookmark(
            this.bookKey,
            this.autobookmark,
            "manual"
        );
    }
    removeManualBookmark() {
        this.currentManualBookmarks.forEach((bookmark) =>
            this.rootStore.bookStore.removeBookInteractionBookmark(this.bookKey, bookmark)
        );
    }

    setBookmarkablePositions(bookmarkablePositions: Bookmark[]) {
        this.bookmarkablePositions = bookmarkablePositions;
    }

    get manualBookmarks() {
        const interactionState = this.rootStore.bookStore.getBookInteraction(this.bookKey);
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
        const interaction = this.rootStore.bookStore.getBookInteraction(bookKey);
        const timeRecord = interaction.reading.findLast(
            (timeRecord) => timeRecord.progress !== null
        );
        return timeRecord?.progress ?? null;
    }
    getProgress(bookKey: BookKey) {
        return `${(this.getLastKnownProgress(bookKey) * 100).toFixed(2)}%`;
    }

    addTimeRecord(timeRecord: TimeRecord) {
        this.rootStore.bookStore.addBookInteractionTimeRecord(this.bookKey, timeRecord);
    }

    getActiveDuration(bookKey: BookKey) {
        const interaction = this.rootStore.bookStore.getBookInteraction(bookKey);
        return interaction.reading.reduce((acc, cur) => acc + cur.activeDuration, 0);
    }

    getReadTime(bookKey: BookKey) {
        const duration = this.getActiveDuration(bookKey);
        const seconds = Math.floor(duration / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours === 0 && minutes < 1) return "Not read";

        let timeString = "";

        if (hours > 0) {
            timeString += `${hours} hrs, `;
        }

        if (minutes > 0 || hours === 0) {
            timeString += `${minutes} min`;
        }

        return timeString;
    }

    getPublishDate(bookKey: BookKey) {
        const publishDate = this.rootStore.bookStore.getBookMetadata(bookKey)?.date;
        const isValid = !Number.isNaN(new Date(publishDate).getTime());

        if (!isValid) return null;
        return publishDate.toISOString().split("T")[0];
    }

    getAddedDate(bookKey: BookKey) {
        const addedDate = this.rootStore.bookStore.getFileMetadata(bookKey)?.addedDate;

        if (!addedDate) return null;
        return addedDate.toISOString().split("T")[0];
    }

    getOpenedDate(bookKey: BookKey) {
        const interaction = this.rootStore.bookStore.getBookInteraction(bookKey);
        const lastOpenedDate = interaction.reading.at(-1)?.endDate;
        if (!lastOpenedDate) return null;
        return lastOpenedDate.toISOString().split("T")[0];
    }

    getOpenedTimeAgo(bookKey: BookKey) {
        const interaction = this.rootStore.bookStore.getBookInteraction(bookKey);
        const lastOpenedDate = interaction.reading.at(-1)?.endDate;
        if (!lastOpenedDate) return "never";

        const currentDate = new Date();
        const diff = currentDate.getTime() - lastOpenedDate.getTime();

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) {
            return "just now";
        } else if (minutes < 60) {
            return minutes + " minutes ago";
        } else if (hours < 24) {
            return hours + " hours ago";
        } else if (days === 1) {
            return "yesterday";
        } else if (days < 30) {
            return days + " days ago";
        } else if (months === 1) {
            return "1 month ago";
        } else if (months < 12) {
            return months + " months ago";
        } else if (years === 1) {
            return "1 year ago";
        } else {
            return years + " years ago";
        }
    }
}
