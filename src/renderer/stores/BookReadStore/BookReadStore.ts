import _ from "lodash";
import { makeAutoObservable, observable, runInAction, toJS, when } from "mobx";

import type BookWebComponent from "~/renderer/scenes/Reading/scenes/BookWebComponent";
import type {
    Position,
    SerializedSectionWrappers,
    SerializedWrapper,
    TocState,
    Wrapper,
} from "~/renderer/scenes/Reading/scenes/BookWebComponent";
import { BookKey, TimeRecord } from "../BookStore";
import { RootStore } from "../RootStore";
import { Interface } from "readline/promises";

export interface Bookmark {
    /* Either direct content element index or a paragraph index */
    elementIndex: number | null;
    /* Selector for a paragraph */
    elementSelector: string | null;
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

export type Layout = "single-page" | "two-page";
export interface Person {
    uniqueName: string;
    displayName: string;
    count: number;
}
export class BookReadStore {
    rootStore: RootStore;

    layout: Layout = "single-page";

    pageComponents: { left: BookWebComponent | null; right: BookWebComponent | null } = {
        left: null,
        right: null,
    };
    // bookComponent: BookWebComponent | null = null;
    // bookComponent2: BookWebComponent | null = null;
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
            { rootStore: false, pageComponents: observable.ref },
            { autoBind: true }
        );
        this.rootStore = rootStore;
    }

    get bookComponent() {
        return this.pageComponents.left;
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
        const { elementIndex, elementSelector } = this.autobookmark;
        const { sectionNames } = this.contentState;

        this.pageComponents.right.loadBook(
            this.content,
            toJS(this.metadata),
            this.initSectionIndex,
            toJS(sectionNames),
            toJS(this.wrappers),
            { elementIndex, elementSelector },
            1
        );
        this.pageComponents.left.loadBook(
            this.content,
            toJS(this.metadata),
            this.initSectionIndex,
            toJS(sectionNames),
            toJS(this.wrappers),
            { elementIndex, elementSelector }
        );
        this.pageComponents.right.setOnResize(this.syncPages);
    }

    unload() {
        this.setLeftPageComponent(null);
        this.setRightPageComponent(null);
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

    setLeftPageComponent(pageComponent: BookWebComponent) {
        this.pageComponents.left = pageComponent;
    }
    setRightPageComponent(pageComponent: BookWebComponent) {
        this.pageComponents.right = pageComponent;
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
        return Boolean(this.pageComponents.left);
    }

    get isInitSectionReady() {
        return this.rootStore.bookStore.getBookContentState(this.bookKey).isInitSectionParsed;
    }

    get autobookmark() {
        return this.rootStore.bookStore.getBookInteraction(this.bookKey).bookmarks.auto;
    }

    get wrappers(): SerializedSectionWrappers[] {
        return this.rootStore.bookStore.getBookInteraction(this.bookKey).wrappers;
    }

    get initSectionIndex() {
        const initSectionIndex = this.autobookmark.elementSection;
        return initSectionIndex;
    }

    addHighlight(highlight: SerializedWrapper) {
        this.rootStore.bookStore.addBookInteractionWrap(this.bookKey, highlight);
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

    removeManualBookmark(): void;
    removeManualBookmark(bookmark?: Bookmark): void;
    removeManualBookmark(bookmark?: Bookmark) {
        if (!bookmark) {
            this.currentManualBookmarks.forEach((bookmark) =>
                this.rootStore.bookStore.removeBookInteractionBookmark(this.bookKey, bookmark)
            );
        } else {
            this.rootStore.bookStore.removeBookInteractionBookmark(this.bookKey, bookmark);
        }
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
                bookmark: manualBookmark,
                sectionId: this.contentState.sectionNames[manualBookmark.elementSection],
                label: this.getSectionTitle(manualBookmark.elementSection),
                active: _.some(currentManualBookmarks, (currentManualBookmark) =>
                    _.isEqual(currentManualBookmark, manualBookmark)
                ),
            }))
            .toSorted(
                (a, b) =>
                    a.bookmark.elementSection - b.bookmark.elementSection ||
                    a.bookmark.elementIndex - b.bookmark.elementIndex
            );
    }

    /**
     * Returns all manual bookmarks on current page
     */
    get currentManualBookmarks(): Bookmark[] {
        const manual = this.manualBookmarks;

        const currentManualBookmarks = _.intersectionWith(
            manual,
            this.bookmarkablePositions,
            _.isEqual
        );
        return currentManualBookmarks;
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

    get textAnalysisProgress() {
        return this.rootStore.bookStore.getTextAnalysisProgress(this.bookKey);
    }

    get isTextAnalysisDone() {
        return this.textAnalysisProgress === 1;
    }

    get textAnalysis() {
        return this.rootStore.bookStore.getTextAnalysis(this.bookKey);
    }

    isSectionAnalysisReady(sectionIndex: number = this.tocState.currentSection) {
        const textAnalysis = this.rootStore.bookStore.getTextAnalysis(this.bookKey);
        if (textAnalysis === null) return false;
        if (textAnalysis[sectionIndex].people === null) return false;

        return true;
    }

    isSectionAnalysisRequested(sectionIndex: number = this.tocState.currentSection) {
        const textAnalysis = this.rootStore.bookStore.getTextAnalysis(this.bookKey);
        return Boolean(textAnalysis?.[sectionIndex]?.isAnalysisRequested);
    }

    getPersonContextRecords(
        uniqueName: string,
        limit = 10,
        sectionIndex = this.tocState.currentSection
    ) {
        const people = this.textAnalysis?.[sectionIndex]?.people;
        if (!people) return null;

        const contexts = people.nameOffsets[uniqueName].map(
            (nameOffset) => `...${nameOffset.context}...`
        );

        if (limit === 0 || limit >= contexts.length) return contexts;

        const step = Math.floor(contexts.length / (limit + 1));

        // Select elements with the most distance between them
        const limitedContext = [];
        for (let i = 1; i <= limit; i++) {
            limitedContext.push(contexts[i * step]);
        }

        return limitedContext;
    }

    getPeople(sectionIndex = this.tocState.currentSection): Person[] {
        const people = this.textAnalysis?.[sectionIndex]?.people;
        if (!people) return [];

        return people.uniqueNames
            .map((uniqueName) => ({
                uniqueName,
                displayName: people.displayNames[uniqueName],
                count: people.nameOffsets[uniqueName].length,
            }))
            .sort((a, b) => b.count - a.count)
            .filter((person) => person.count > 1);
    }

    requestTextAnalysis(
        sectionIndex: number = this.tocState.currentSection,
        text: string = this.pageComponents.left?.contentText
    ) {
        if (!this.isInitSectionReady) return;
        this.rootStore.bookStore.requestTextAnalysis(this.bookKey, sectionIndex, text);
    }

    flipNPages(n: number) {
        const { left, right } = this.pageComponents;
        if (this.layout === "two-page") n *= 2;

        left?.flipNPages?.(n);
        this.syncPages();
    }

    pageForward() {
        let n = 1;
        const { left, right } = this.pageComponents;
        if (this.layout === "two-page") n *= 2;

        left?.flipNPages?.(n);
        this.syncPages();
    }
    pageBackward() {
        let n = -1;
        const { left } = this.pageComponents;
        if (this.layout === "two-page") n *= 2;

        left?.flipNPages?.(n);
        this.syncPages();
    }
    sectionForward() {
        const { left } = this.pageComponents;

        left?.sectionForward?.();
        this.syncPages();
    }
    sectionBackward() {
        const { left } = this.pageComponents;

        left?.sectionBackward?.();
        this.syncPages();
    }
    navToLink(sectionId: string, position?: Position) {
        const { left } = this.pageComponents;

        left?.navToLink?.(sectionId, position);
        this.syncPages();
    }

    get layouts(): Layout[] {
        return ["single-page", "two-page"];
    }

    setLayout(layout: Layout) {
        this.syncPages();
        this.layout = layout;
    }

    syncPages() {
        if (!this.pageComponents.left || !this.pageComponents.right) return;
        const { currentSectionPage } = this.pageComponents.left.getBookUiState();

        const currentLeftSection = this.pageComponents.left.state.book.currentSection;
        const currentRightSection = this.pageComponents.right.state.book.currentSection;

        if (currentLeftSection === currentRightSection) {
            this.pageComponents.right.navToPos({
                sectionPage: { value: currentSectionPage, isFromBack: false },
            });
        } else {
            this.pageComponents.right.loadSection(currentLeftSection, {
                sectionPage: { value: currentSectionPage, isFromBack: false },
            });
        }
    }

    unloadBook() {
        const { left, right } = this.pageComponents;

        left?.unloadBook?.();
        right?.unloadBook?.();
    }

    highlight(wrapper: SerializedWrapper) {
        const { left, right } = this.pageComponents;

        left?.wrap?.(wrapper);
        right?.wrap?.(wrapper);
    }

    unhighlight(uniqueAttrs: { [attr: string]: string }) {
        const { left, right } = this.pageComponents;

        // left?.unwrap?.(uniqueAttrs);
        // right?.unwrap?.(uniqueAttrs);
    }
}
