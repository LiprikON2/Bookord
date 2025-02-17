import debounce from "lodash/debounce";

import PageCounter from "./components/PageCounter";
import StyleLoader from "./components/StyleLoader";
import StateManager from "./components/StateManager";
import QuerySerializer from "./components/QuerySerializer";
import {
    appendIdToClassName,
    deserializeRange,
    doesRangeContainsClass,
    getDirectDescendant,
    getFirstNonTextElement,
    SerializedRange,
    serializeRange,
    splitRange,
} from "./components/DomHelpers";
import { template } from "./components/Template";
import { BookContent, BookContentState, BookMetadata, Bookmark } from "~/renderer/stores";
import { isDev } from "~/common/helpers";

export type Position = {
    sectionPage?: { value: number; isFromBack: boolean };
    markerId?: string;
    elementIndex?: number | null;
    elementSelector?: string;
    element?: HTMLElement;
};

type Book = BookContent & {
    sectionNames: BookContentState["sectionNames"];
    metadata: BookMetadata;
};

export type TocState = {
    currentSectionName: string | null;
    currentSection: number | null;
    currentSectionTitle: string | null;
    sectionNames: string[] | null;
};

interface ContextMenuEventDetail {
    event: MouseEvent;
    startElement: ParentNode;
    startElementSelectedText: string;
    selectedText: string;
    selectionPosition: { x: number; y: number };
    canBeHighlighted: boolean;
    wrapper: SerializedWrapper;
}
interface WrapContextMenuEventDetail {
    event: MouseEvent;
    instanceAttrs: Wrapper["instanceAttrs"];
    firstWrapBlockPosition: { x: number; y: number };
}

interface BookmarkPositionsEventDetail {
    auto: Bookmark;
    manual: Bookmark[];
}

interface ImgClickEventDetail {
    src: string;
}

export interface Wrapper {
    ranges: Range[];
    serializedRanges: SerializedRange[];
    sectionIndex: number;
    wrapperConfig: { tag: string; attrs: { [attr: string]: string } };
    instanceAttrs: {
        [attr: string]: string;
    };
}

export type SerializedWrapper = Omit<Wrapper, "ranges">;

export interface SerializedSectionWrappers {
    highlights: SerializedWrapper[];
}
export type SectionWrappers = {
    highlights: Wrapper[];
};

export interface BookWebComponentEventMap extends HTMLElementEventMap {
    imgClickEvent: MouseEvent & { detail: ImgClickEventDetail };
    uiStateUpdateEvent: Event & { detail: UiState };
    tocStateUpdateEvent: Event & { detail: TocState };
    contextMenuEvent: MouseEvent & { detail: ContextMenuEventDetail };
    wrapEvent: MouseEvent & { detail: SerializedWrapper };
    wrapContextMenuEvent: MouseEvent & { detail: WrapContextMenuEventDetail };

    bookmarkPositionsEvent: Event & {
        detail: BookmarkPositionsEventDetail;
    };
}

interface BookmarkableContentElement {
    element: Element | null;
    intersectionRatio: number | null;
    elementSection: number | null;
    elementIndex: number | null;
}

interface ElementVisibility {
    element: Element | null;
    elementIndex: number | null;
    intersectionRatio: number | null;
}

/**
 * Book web component
 */
export default class BookWebComponent extends HTMLElement {
    private book: Book = null;
    private wrappers: SectionWrappers[];
    private rootElem: HTMLElement;
    contentElem: HTMLElement;
    private styleElem: HTMLElement;
    private componentStyle: CSSStyleDeclaration;
    private styleLoader: StyleLoader;
    state: StateManager;
    private resizeObserver: ResizeObserver;
    /**
     * Updates `bookmarkElem`, which is used to keep track of the first visible content element
     * as a "current position", therefore negating influence of page width
     */
    private bookmarkObserver: IntersectionObserver;

    /**
     * Best bookmarkable element
     */
    // private bookmarkableElement: BookmarkableContentElement = {
    //     element: null,
    //     intersectionRatio: null,
    //     elementSection: null,
    //     elementIndex: null,
    // };

    private elementVisibilites: ElementVisibility[] = [];

    /**
     * Hides focusabel elements (mainly links) on another pages so they can't be tabbed onto without being visible
     */
    private focusableObserver: IntersectionObserver;
    private pageOffset = 0;

    /**
     * TODO
     */
    // pagePreview

    private onDisconnect = () => {};
    private onResize: () => void = null;

    readonly highlightConfig: Wrapper["wrapperConfig"] = {
        tag: "span",
        attrs: { class: "highlighted" },
    };

    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.rootElem = this.shadowRoot.getElementById("root");
        this.contentElem = this.shadowRoot.getElementById("book-content");
        this.styleElem = this.shadowRoot.getElementById("book-style");

        this.componentStyle = getComputedStyle(this.rootElem);

        // this.pageCounter = new PageCounter(this);
        this.styleLoader = new StyleLoader(this.styleElem);
        this.state = new StateManager(this);

        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.rootElem);

        this.bookmarkObserver = new IntersectionObserver((entries) => {
            entries.forEach(
                (entry) => {
                    const isVisible = entry.isIntersecting;
                    if (!isVisible) return;

                    this.updateElementVisibility(entry.target, entry.intersectionRatio);
                    this.emitBookmarkPositions();
                },
                { root: this.contentElem }
            );
        });
        this.focusableObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const isVisible = entry.isIntersecting;

                if (!isVisible) {
                    if (entry.target instanceof HTMLElement) {
                        entry.target.style.visibility = "hidden";
                    }
                } else {
                    if (entry.target instanceof HTMLElement) {
                        entry.target.style.visibility = "";
                    }
                }
            });
        });

        this.contentElem.addEventListener(
            "contextmenu",
            (e) => new QuerySerializer(this.contentElem, e.target)
        );
    }

    serializeQuery(element: HTMLElement | Node) {
        const querySerializer = new QuerySerializer(this.contentElem, element);
        return querySerializer.needle;
    }

    updateElementVisibility(element: Element, intersectionRatio: number) {
        const elementIndex = this.contentParagraphs.indexOf(element);

        const elementVisibility = this.elementVisibilites.find(
            (elementVisibility) => elementVisibility.elementIndex === elementIndex
        );

        if (elementVisibility) elementVisibility.intersectionRatio = intersectionRatio;
        else this.elementVisibilites.push({ element, elementIndex, intersectionRatio });
    }

    resetElementVisibilities() {
        this.elementVisibilites = [];
    }

    get bookmarkableElements(): Bookmark[] {
        return this.elementVisibilites
            .filter(({ intersectionRatio }) => intersectionRatio > 0)
            .map(({ elementIndex }) => ({
                elementIndex,
                elementSection: this.state.book.currentSection,
                elementSelector:
                    this.hasParagraphs && elementIndex ? `p:nth-child(${elementIndex + 1})` : null,
            }));
    }

    setOnDisconnect(onDisconnect: () => void) {
        this.onDisconnect = onDisconnect;
    }

    get bestVisibleElement(): [Element, Bookmark] {
        const bookmarkableIndex = Math.min(1, this.bookmarkableElements.length);
        const bestBookmarkable =
            this.bookmarkableElements[bookmarkableIndex] ??
            ({
                elementIndex: null,
                elementSelector: null,
                elementSection: this.state.book.currentSection,
            } as Bookmark);

        const bestElement = this.contentParagraphs[bestBookmarkable.elementIndex] ?? null;

        return [bestElement, this.bookmarkableElements[bookmarkableIndex]];
    }

    /**
     * Emits "bookmarkPositionsEvent" with a new or updated bookmark
     */
    emitBookmarkPositions() {
        const elementIndex =
            this.bookmarkableElements[Math.min(1, this.bookmarkableElements.length)]
                ?.elementIndex ?? 0;
        const elementSection = this.state.book.currentSection;
        const elementSelector =
            this.hasParagraphs && elementIndex ? `p:nth-child(${elementIndex + 1})` : null;

        const auto: Bookmark = {
            elementSection,
            elementIndex,
            elementSelector,
        };

        const manual = this.bookmarkableElements;

        const bookmarkEvent = new CustomEvent<BookmarkPositionsEventDetail>(
            "bookmarkPositionsEvent",
            {
                bubbles: true,
                cancelable: false,
                composed: true,
                detail: {
                    auto,
                    manual,
                },
            }
        );

        this.dispatchEvent(bookmarkEvent);
    }

    private updateObservers() {
        this.updateBookmarkObserver();
        this.updateFocusableObserver();
    }

    private updateBookmarkObserver() {
        this.bookmarkObserver.disconnect();
        this.resetElementVisibilities();

        this.contentParagraphs.forEach((childElem) => this.bookmarkObserver.observe(childElem));
    }

    private updateFocusableObserver() {
        this.focusableObserver.disconnect();
        this.focusableElements.forEach((focusableElem) =>
            this.focusableObserver.observe(focusableElem)
        );
    }

    private onSectionLoad(currentPos: Position) {
        this.navToPos(currentPos);

        this.emitTocState({
            currentSectionName: this.currentSectionName,
            sectionNames: this.book.sectionNames,
            currentSection: this.state.book.currentSection,
            currentSectionTitle: this.state.section.title,
        });
        const uiState = this.getBookUiState();
        this.emitUiState(uiState);
    }

    resize() {
        if (this.onResize) return this.onResize();

        const [element] = this.bestVisibleElement;

        if (element instanceof HTMLElement) this.shiftToElement({ element }, null);
        else {
            const offset = this.getPageEdgeOffset(this.currentOffset);
            this.setOffset(offset, null);
        }
        this.updateFocusableObserver();

        const uiState = this.getBookUiState();
        this.emitUiState(uiState);
    }

    setOnResize(onResize: () => void) {
        this.onResize = onResize;
    }

    onSectionShift() {
        this.updateObservers();

        const uiState = this.getBookUiState();
        this.emitUiState(uiState);
    }

    /**
     * Returns list of elements that can be tabbed onto
     * ref: https://stackoverflow.com/a/30753870/10744339
     */
    private get focusableElements() {
        return [
            ...this.contentElem.querySelectorAll(
                "a[href]:not([tabindex='-1']), area[href]:not([tabindex='-1']), input:not([disabled]):not([tabindex='-1']), select:not([disabled]):not([tabindex='-1']), textarea:not([disabled]):not([tabindex='-1']), button:not([disabled]):not([tabindex='-1']), iframe:not([tabindex='-1']), [tabindex]:not([tabindex='-1']), [contentEditable=true]:not([tabindex='-1'])"
            ),
        ];
    }

    get contentText() {
        return this.contentElem.textContent;
    }

    get contentChildren() {
        return [...this.contentElem.children];
    }

    get contentParagraphs() {
        const paragraphs = [...this.contentElem.querySelectorAll("p")];
        if (paragraphs.length) return paragraphs;

        return this.contentChildren;
    }

    get hasParagraphs() {
        return Boolean(this.contentParagraphs.length);
    }

    get totalSections() {
        return this?.book?.sectionNames?.length ?? 0;
    }

    loadBook(
        content: BookContent,
        metadata: BookMetadata,
        sectionIndex: number,
        sectionNames: BookContentState["sectionNames"],
        serializedSectionWrappers: SerializedSectionWrappers[],
        position?: Position,
        pageOffset = 0
    ) {
        const isInitialLoad = !this.book;

        if (isInitialLoad) {
            this.pageOffset = pageOffset;
            this.book = { ...content, sectionNames, metadata };
            this.wrappers = serializedSectionWrappers.map((serializedSectionWrapper) => ({
                highlights: serializedSectionWrapper.highlights.map((highlight) => ({
                    ...highlight,
                    ranges: [] as Range[],
                })),
            }));
            this.loadSection(sectionIndex, position);
            this.state.setInitBookInfo(this.book.sectionNames.length);
        }
    }

    unloadBook() {
        this.book = null;
        this.pageOffset = 0;
        this.state = new StateManager(this);
        this.resetElementVisibilities();
    }

    get initPosition(): Position {
        return {
            sectionPage: { value: 0, isFromBack: false },
            elementIndex: null,
            elementSelector: "",
        };
    }

    get currentSectionName(): TocState["currentSectionName"] {
        if (!this.book?.sectionNames) return null;

        const { currentSection } = this.state.book;
        const currentSectionName = this.book.sectionNames[currentSection];
        return currentSectionName;
    }

    /**
     * Loads specified book section along with its styles, sets event listeners, updates UI and saves interaction progress
     */
    loadSection(sectionIndex: number, position?: Position) {
        const currentPos = { ...this.initPosition, ...position };

        const sectionContent = this.getSection(sectionIndex);
        if (!sectionContent) return;

        this.state.updateState(this.book, sectionIndex);
        this.styleLoader.loadStyles(this.book.styles, sectionContent);
        this.loadContent(sectionContent);

        this.onSectionLoad(currentPos);
    }

    /**
     * Loads book's content and appends a end-marker to it
     */
    private loadContent(sectionContent: ArrayElement<Book["sections"]>["content"]) {
        this.contentElem.innerHTML = "";

        // Remove head tag from section
        const headlessSectionContent = sectionContent.slice(1);
        this.recCreateElements(this.contentElem, headlessSectionContent);

        this.processContentImages();
        this.processContentLinks();
        this.processWrappers();
        this.attachContextMenuHandler();
    }

    private processWrappers() {
        const { currentSection } = this.state.book;

        this.wrappers[currentSection].highlights.forEach(
            ({ serializedRanges, wrapperConfig, instanceAttrs }) => {
                const firstRange = deserializeRange(serializedRanges[0], this.contentElem);

                serializedRanges.forEach((serializedRange) => {
                    const range = deserializeRange(serializedRange, this.contentElem);
                    const wrapperElem = this.wrapBlockRange(
                        range,
                        wrapperConfig.tag,
                        instanceAttrs
                    );
                    wrapperElem.addEventListener("click", (e) =>
                        this.emitWrapContextMenuEvent(e, firstRange, instanceAttrs)
                    );
                });
            }
        );
    }

    /**
     * Recursively creates and appends child elements to the respective child's parent
     */
    private recCreateElements(parent: HTMLElement, children: any[]) {
        children.map((element) => {
            if (element?.tag !== undefined) {
                const tag = document.createElement(element.tag);
                if (element?.attrs !== undefined) {
                    Object.keys(element.attrs).forEach((attr) => {
                        const attrVal = element.attrs[attr];

                        if (attrVal !== undefined) {
                            tag.setAttribute(attr, attrVal);
                        }
                    });
                }
                if (element?.children !== undefined) {
                    this.recCreateElements(tag, element.children);
                }
                parent.appendChild(tag);
            } else {
                const textNode = document.createTextNode(element.text);
                parent.appendChild(textNode);
            }
        });
    }

    private attachContextMenuHandler() {
        this.contentElem.addEventListener("contextmenu", (e: MouseEvent) => {
            // @ts-ignore
            const selection: Selection = this.shadowRoot.getSelection();
            if (!selection || selection.rangeCount < 1) return;

            const selectedText = selection.toString();
            const range = selection.getRangeAt(0);
            const startElement = range.startContainer.parentNode;
            const [startElementSelectedText] = selectedText.split("\n");

            const rect = range.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top;
            const selectionPosition = { x, y };

            const wrapper = this.createWrapper();
            const canBeHighlighted = wrapper !== null;

            if (startElement && startElementSelectedText) {
                e.stopPropagation();
                this.emitContextMenuEvent(
                    e,
                    startElement,
                    startElementSelectedText,
                    selectedText,
                    selectionPosition,
                    canBeHighlighted,
                    wrapper
                );
            }
        });
    }

    private emitContextMenuEvent(
        event: MouseEvent,
        startElement: ParentNode,
        startElementSelectedText: string,
        selectedText: string,
        selectionPosition: { x: number; y: number },
        canBeHighlighted: boolean,
        wrapper: SerializedWrapper
    ) {
        const contextMenuEvent = new CustomEvent<ContextMenuEventDetail>("contextMenuEvent", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {
                event,
                startElement,
                startElementSelectedText,
                selectedText,
                selectionPosition,
                canBeHighlighted,
                wrapper,
            },
        });

        this.dispatchEvent(contextMenuEvent);
    }

    private processContentLinks() {
        const anchors = this.contentElem.querySelectorAll("a");
        anchors.forEach((a) => {
            a.addEventListener("click", (e) => this.handleLink(e));
        });
    }

    /**
     * Handles clicks on book navigation links and website links
     */
    private handleLink(e: Event) {
        const target = e.currentTarget;
        if (!(target instanceof HTMLAnchorElement)) return;

        e.preventDefault();

        let [sectionName, markerId] = target.href.split("#").pop().split(",");
        markerId = "#" + markerId;

        const isLinkValid = this.navToLink(sectionName, { markerId });

        // Opens link in external browser
        if (!isLinkValid && target.href) window.open(target.href, "_blank");
    }

    navToLink(sectionId: string, position?: Position) {
        const sectionIndex = this.book.sectionNames.findIndex(
            (sectionName) => sectionName === sectionId
        );
        const doesSectionExist = sectionIndex !== -1;

        if (doesSectionExist) {
            const isWithingCurrentSection = sectionIndex === this.state.book.currentSection;
            if (isWithingCurrentSection) {
                if (position) this.navToPos(position);
                else this.navToPos({ elementIndex: 0 });
            } else this.loadSection(sectionIndex, position);
        }

        return doesSectionExist;
    }

    private createWrapper(wrapperConfig = this.highlightConfig) {
        // @ts-ignore
        const selection: Selection = this.shadowRoot.getSelection();
        if (!selection || selection.rangeCount < 1) return;

        const range = selection.getRangeAt(0).cloneRange();
        const wrapper = this.createWrapperFromRange(range, wrapperConfig);

        return wrapper;
    }

    wrap(wrapper: SerializedWrapper, wrapperConfig = this.highlightConfig) {
        // // @ts-ignore
        // const selection = this.shadowRoot.getSelection();
        // this.getWrapper(selection, wrapperConfig.tag, wrapperConfig.attrs);
    }

    getWrapperByClassName(
        className: string,
        sectionIndex: number = this.state.book.currentSection
    ) {
        // TODO remove 'highlights
        return this.wrappers[sectionIndex].highlights.find(
            (highlight) => highlight.instanceAttrs.class === className
        );
    }

    unwrap(ranges: Range[], instanceAttrs: { [attr: string]: string }) {
        const wrappers = this.contentElem.querySelectorAll(
            "." + instanceAttrs.class.replaceAll(" ", ".")
        );

        if (ranges.length !== wrappers.length) return;

        for (let i = 0; i < ranges.length; i++) {
            const parentElement = wrappers[i].parentNode;
            while (wrappers[i].firstChild) {
                parentElement.insertBefore(wrappers[i].firstChild, wrappers[i]);
            }

            parentElement.removeChild(wrappers[i]);

            const childNodes = [...ranges[i].commonAncestorContainer.childNodes];
            childNodes.forEach((node) => parentElement.appendChild(node));
        }
    }

    private createWrapperFromRange(range: Range, wrapperConfig: Wrapper["wrapperConfig"]) {
        const doesIntersectWrapOfTheSameType = doesRangeContainsClass(
            this.contentElem,
            range,
            wrapperConfig.attrs.class
        );

        if (doesIntersectWrapOfTheSameType) return null;

        const sectionIndex = this.state.book.currentSection;
        const instanceAttrs = {
            ...wrapperConfig.attrs,
            class: appendIdToClassName(wrapperConfig.attrs.class),
        };

        const serializedRange = serializeRange(range, this.contentElem);
        const deserializedRange = deserializeRange(serializedRange, this.contentElem);

        const wrapper = {
            sectionIndex,
            serializedRanges: [serializedRange],
            wrapperConfig,
            instanceAttrs,
        };

        try {
            this.validateWrapper(wrapper, wrapperConfig);
        } catch (e) {
            // Range is not a single block and cannot be wrapped so it needs to be split first
            if (e instanceof DOMException) {
                const ranges = splitRange(range);

                const serializedRanges = ranges.map((range) =>
                    serializeRange(range, this.contentElem)
                );
                wrapper.serializedRanges = serializedRanges;
            }
        }
        return wrapper;
    }

    private validateWrapper(wrapper: SerializedWrapper, wrapperConfig: Wrapper["wrapperConfig"]) {
        const deserializedRange = deserializeRange(wrapper.serializedRanges[0], this.contentElem);

        const treeRoot = getFirstNonTextElement(deserializedRange.commonAncestorContainer)[0]
            .parentNode as HTMLElement;

        const tempTree = treeRoot.cloneNode(true);
        const tempFrag = this.shadowRoot.getElementById("temp-document-fragment");
        tempFrag.innerHTML = "";
        tempFrag.append(tempTree);

        const serializedRangeReduced = serializeRange(deserializedRange, treeRoot);
        const deserializedRangeReduced = deserializeRange(serializedRangeReduced, tempFrag);

        this.wrapBlockRange(deserializedRangeReduced, wrapperConfig.tag, wrapperConfig.attrs);
    }

    private wrapBlockRange(range: Range, tag: string, instanceAttrs: { [attr: string]: string }) {
        const wrapperElem = document.createElement(tag);
        Object.keys(instanceAttrs).forEach((key) =>
            wrapperElem.setAttribute(key, instanceAttrs[key])
        );

        range.surroundContents(wrapperElem);

        return wrapperElem;
    }

    /**
     * Emits "wrapEvent"
     */
    private emitWrapEvent(wrapper: SerializedWrapper) {
        const wrapEvent = new CustomEvent<SerializedWrapper>("wrapEvent", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: wrapper,
        });
        this.dispatchEvent(wrapEvent);
    }

    /**
     * Emits "wrapContextMenuEvent"
     */
    private emitWrapContextMenuEvent(
        event: MouseEvent,
        firstRange: Range,
        instanceAttrs: WrapContextMenuEventDetail["instanceAttrs"]
    ) {
        const rect = firstRange.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top;
        const firstWrapBlockPosition = { x, y };

        const contextMenuEvent = new CustomEvent<WrapContextMenuEventDetail>(
            "wrapContextMenuEvent",
            {
                bubbles: true,
                cancelable: false,
                composed: true,
                detail: {
                    event,
                    firstWrapBlockPosition,
                    instanceAttrs,
                },
            }
        );

        this.dispatchEvent(contextMenuEvent);
    }

    /**
     * Attaches event emitter to img tags to handle open modals on click
     */
    private processContentImages() {
        const images = this.contentElem.querySelectorAll("img");

        images.forEach((img) => {
            img.addEventListener("click", this.emitImgClickEvent);
            this.applyCenteringStyles(img);
        });
    }

    /**
     * Makes div parents (up to contentElem) of the provided image tag to center their content
     */
    private applyCenteringStyles(imgElement: HTMLImageElement) {
        const isDecorativeImage =
            imgElement.alt === "" ||
            imgElement.role === "presentation" ||
            imgElement.role === "none";

        if (!isDecorativeImage) {
            let imgContainer = imgElement.parentNode;
            if (!(imgContainer instanceof HTMLElement)) return;

            while (imgContainer !== this.contentElem && imgContainer.children.length === 1) {
                imgContainer.style.display = "flex";
                imgContainer.style.justifyContent = "center";
                imgContainer.style.alignItems = "center";
                imgContainer.style.height = "100%";
                imgContainer.style.margin = "auto";

                imgContainer = imgContainer.parentNode;
                if (!(imgContainer instanceof HTMLElement)) return;
            }
        }
    }

    /**
     * Emits "imgClickEvent" for when the img tag is clicked
     */
    private emitImgClickEvent(e: MouseEvent) {
        const target = e.target;
        if (!(target instanceof HTMLImageElement)) return;

        const imgClickEvent = new CustomEvent<ImgClickEventDetail>("imgClickEvent", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: { src: target.src },
        });

        this.dispatchEvent(imgClickEvent);
    }

    /**
     * Flips one page forward
     */
    pageForward() {
        this.flipNPages(1);
    }

    /**
     * Flips one page backward
     */
    pageBackward() {
        this.flipNPages(-1);
    }

    get doesNextSectionExist() {
        const lastSection = this.totalSections - 1;
        const { currentSection } = this.state.book;
        const nextSection = currentSection + 1;

        const doesNextSectionExist = nextSection <= lastSection;
        return doesNextSectionExist;
    }

    get doesPrevSectionExist() {
        const firstSection = 0;
        const { currentSection } = this.state.book;
        const prevSection = currentSection - 1;

        const doesPrevSectionExist = prevSection >= firstSection;
        return doesPrevSectionExist;
    }

    get doesNextSectionPageExist() {
        const { currentPage: currentSectionPage, lastPage: lastSectionPage } = this.state.section;
        const nextSectionPage = currentSectionPage + 1;

        const doesNextSectionPageExist = nextSectionPage <= lastSectionPage;
        return doesNextSectionPageExist;
    }
    get doesPrevSectionPageExist() {
        const { currentPage: currentSectionPage, firstPage: firstSectionPage } = this.state.section;
        const prevSectionPage = currentSectionPage + 1;

        const doesPrevSectionPageExist = prevSectionPage >= firstSectionPage;
        return doesPrevSectionPageExist;
    }

    get doesNextPageExist() {
        if (this.doesNextSectionExist) return true;
        return this.doesNextSectionPageExist;
    }
    get doesPrevPageExist() {
        if (this.doesPrevSectionExist) return true;
        return this.doesNextSectionPageExist;
    }

    /**
     * Flips specified amout of pages forward or backwards
     */
    flipNPages(n: number) {
        if (n === 0 || !this.book) return;

        const { firstPage: firstSectionPage, lastPage: lastSectionPage } = this.state.section;
        const currentSectionPage = this.state.section.currentPage;
        const requestedSectionPage = currentSectionPage + n;

        const { currentSection } = this.state.book;
        const nextSection = currentSection + 1;
        const prevSection = currentSection - 1;

        const doesNextSectionExist = this.doesNextSectionExist;
        const doesPrevSectionExist = this.doesPrevSectionExist;

        const didRequestSucceedingSection = requestedSectionPage > lastSectionPage;
        const didRequestPreceedingSection = requestedSectionPage < firstSectionPage;
        const didRequestThisSection = !didRequestPreceedingSection && !didRequestSucceedingSection;

        if (didRequestThisSection) {
            this.shiftToSectionPage(requestedSectionPage);
        } else if (didRequestSucceedingSection) {
            if (doesNextSectionExist) {
                const nextSectionPage = n - 1 - (lastSectionPage - currentSectionPage);
                const position = {
                    sectionPage: { value: nextSectionPage, isFromBack: false },
                };
                this.loadSection(nextSection, position);
            } else {
                // Default to the last page
                this.shiftToSectionPage(lastSectionPage);
            }
        } else if (didRequestPreceedingSection) {
            if (doesPrevSectionExist) {
                const prevSectionPage = n + 1 - (firstSectionPage - currentSectionPage);
                const position = {
                    sectionPage: { value: prevSectionPage, isFromBack: true },
                };

                this.loadSection(prevSection, position);
            } else {
                // Default to the first page
                this.shiftToSectionPage(firstSectionPage);
            }
        }
    }

    /**
     * Flips one section forward
     */
    sectionForward() {
        this.flipNSections(1, false);
    }

    /**
     * Flips one section backward
     */
    sectionBackward() {
        this.flipNSections(-1, false);
    }

    /**
     * Flips specified amout of sections forward or backward
     */
    flipNSections(n: number, isFromBack: boolean | null = null) {
        if (!this.book) return;
        const { currentSection } = this.state.book;
        this.shiftToSection(currentSection + n, isFromBack);
    }

    /**
     * Flips N pages of a book if they are within the section
     */
    private shiftToSectionPage(page: number) {
        const displayWidth = this.displayWidth;
        const newOffset = page * displayWidth;

        this.setOffset(newOffset);
    }

    private shiftToSection(sectionNum: number, isFromBack: boolean | null = null) {
        const { currentSection } = this.state.book;

        const targetSection = Math.max(0, Math.min(sectionNum, this.totalSections - 1));
        if (targetSection === currentSection) return;

        if (isFromBack === null) isFromBack = currentSection > targetSection;
        this.loadSection(targetSection, { sectionPage: { value: 0, isFromBack } });
    }

    navToPos({ sectionPage, elementIndex, elementSelector }: Position) {
        if (elementSelector || elementIndex || elementIndex === 0) {
            this.shiftToElement({ elementIndex, elementSelector });
        } else if (sectionPage) {
            if (!sectionPage.isFromBack) {
                const { firstPage } = this.state.section;
                this.shiftToSectionPage(firstPage);

                const targetPage = sectionPage.value;
                this.flipNPages(targetPage);
            } else if (sectionPage.isFromBack) {
                const { lastPage } = this.state.section;
                this.shiftToSectionPage(lastPage);

                const targetPage = sectionPage.value;
                this.flipNPages(targetPage);
            }
        }
    }

    /**
     * Shifts offset to the page with the given element.
     * Element can be passed either by `elementIndex`, `elementSelector` or `element`.
     * The `elementIndex` is given precedence over `elementSelector`,
     * and `elementSelector` is given precedence over `element`.
     */
    shiftToElement(
        { element, elementIndex, elementSelector }: Position,
        callback = () => this.onSectionShift()
    ) {
        if (elementSelector) {
            element = this.contentElem.querySelector(elementSelector);
        } else if (elementIndex || elementIndex === 0) {
            element = this.getElementByIndex(elementIndex);
        }

        if (element) {
            const targetOffset = this.getElementOffset(element);
            if (targetOffset || targetOffset === 0) this.setOffset(targetOffset, callback);
        }
    }

    /**
     * Returns book's section object
     */
    private getSection(sectionIndex: number) {
        if (sectionIndex > this.book.sections.length - 1 || sectionIndex < 0) {
            throw new Error("Requested section is out of range.");
        }
        return this.book.sections[sectionIndex]?.content;
    }

    /**
     * Updates book's UI elements such as book title, section title and page counters
     */
    getBookUiState() {
        const currentSectionPage = this.state.section.currentPage;
        const totalSectionPages = this.state.section.totalPages;

        // const currentBookPage = this.stateManager.getCurrentBookPage();
        // const totalBookPages = this.stateManager.getTotalBookPages();
        const currentBookPage = 0;
        const totalBookPages = 0;

        const uiState = {
            currentSectionTitle: this.state.section.title,
            currentSectionPage,
            totalSectionPages,
            currentBookPage,
            totalBookPages,
            nextPage: this.doesNextPageExist,
            prevPage: this.doesPrevPageExist,
        };

        return uiState;
    }

    /**
     * Emits "uiStateUpdateEvent"
     */
    private emitUiState(uiState: UiState) {
        const uiStateUpdateEvent = new CustomEvent<UiState>("uiStateUpdateEvent", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: uiState,
        });
        this.dispatchEvent(uiStateUpdateEvent);
    }
    /**
     * Emits "tocStateUpdateEvent"
     */
    private emitTocState(tocState: TocState) {
        const tocStateUpdateEvent = new CustomEvent<TocState>("tocStateUpdateEvent", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: tocState,
        });

        this.dispatchEvent(tocStateUpdateEvent);
    }

    /**
     * Returns element's offset
     * @param {HTMLElement} elem
     * @param {boolean} [roundToEdge] - whether to round offset to the nearest multiple of page widths
     */
    getElementOffset(elem: HTMLElement, roundToEdge = true) {
        const elemOffset = elem?.offsetLeft;

        if (!elemOffset && elemOffset !== 0) return null;
        if (!roundToEdge) return elemOffset;

        return this.getPageEdgeOffset(elemOffset);
    }

    /**
     * Rounds offset to the nearest multiple of page widths (left edge of the page)
     * @param offset offset width from top right corner of the element
     */
    getPageEdgeOffset(offset: number) {
        const { displayWidth } = this;
        return Math.round(offset / displayWidth) * displayWidth;
    }

    /**
     * Sets pixel offset as a way to advance pages within a section
     */
    private setOffset(offset: number, callback = () => this.onSectionShift()) {
        const nextOffset = Number(offset) + this.pageOffset * this.displayWidth;
        this.contentElem.style.transform = `translate(-${nextOffset}px)`;

        callback?.();
    }

    get currentOffset() {
        // Strips all non-numeric characters from a string
        const currentOffset = parseFloat(this.contentElem.style.transform.replace(/[^\d.-]/g, ""));
        return isNaN(currentOffset) ? 0 : Math.abs(currentOffset);
    }

    /**
     * Returns book content's width
     * @returns {number} a positive number
     */
    get displayWidth() {
        // `.clientWidth` cannot be used as it is rounded to the nearest integer
        const displayWidth = this.contentElem.getBoundingClientRect().width + this.columnGap;
        return displayWidth;
    }

    /**
     * Returns offset to the right edge of content
     * @returns {number} a positive number of pixels
     */
    get totalDisplayWidth() {
        // `.scrollWidth` returns an integer even though
        // the actual width is not an integer
        const approximateTotalWidth = this.contentElem.scrollWidth + this.columnGap;
        const totalWidth = this.getPageEdgeOffset(approximateTotalWidth);

        return totalWidth;
    }

    /**
     * Returns the invisible column gap between the pages in pixels
     * @returns {number}
     */
    get columnGap() {
        return parseInt(this.componentStyle.getPropertyValue("--column-gap"));
    }

    // /**
    //  * TODO implement: Jumps straight to the particular book page
    //  * @param {number} page - book page
    //  */
    // jumpToPage(page) {
    //     // if (this.status === "loading") return;
    //     // const validPage = this.#enforcePageRange(page);
    //     // const currentPage = this.stateManager.getCurrentBookPage();
    //     // const nPageShift = validPage - currentPage - 1;
    //     // const nextSection = this.stateManager.getSectionBookPageBelongsTo(validPage);
    //     // const currentSection = this.stateManager.book.currentSection;
    //     // // Avoid loading the loaded section again by flipping pages instead
    //     // if (nextSection === currentSection && nPageShift !== 0) {
    //     //     this.#shiftToSectionPage(nPageShift);
    //     // } else if (
    //     //     nextSection !== currentSection &&
    //     //     (this.status === "ready" || this.pageCounter.isCounting)
    //     // ) {
    //     //     const sectionPagesArr = this.stateManager.sectionPagesArr;
    //     //     // Prevents the change of a section before the section is counted
    //     //     if (!this.stateManager.isSectionCounted(nextSection)) {
    //     //         return;
    //     //     }
    //     //     const sumOfPages = this.stateManager._sumFirstNArrayItems(
    //     //         sectionPagesArr,
    //     //         nextSection
    //     //     );
    //     //     // TODO rename
    //     //     const totalNextSectionPage = sectionPagesArr[nextSection];
    //     //     const currentNextSectionPage =
    //     //         currentPage + nPageShift - sumOfPages + totalNextSectionPage;
    //     //     this.loadSection(nextSection, currentNextSectionPage);
    //     // }
    // }

    // /**
    //  * Returns page that is guranteed to be withing the borders of a book
    //  * @param {number} page - book page
    //  * @returns {number}
    //  */
    // #enforcePageRange(page: number) {
    //     const minPage = 1;
    //     const maxPage = this.stateManager.getTotalBookPages();
    //     if (page < minPage) {
    //         page = minPage;
    //     } else if (page > maxPage) {
    //         page = maxPage;
    //     }
    //     return page;
    // }

    /**
     * Returns element by the index of descendant elements of contentElem
     * @param {number} index - index of element
     * @returns {Element}
     */
    private getElementByIndex(index: number) {
        return this.contentChildren[index] as HTMLElement;
    }

    // /**
    //  * Recalculates page count
    //  */
    // recount = debounce(
    //     () => {
    //         if (this.isQuitting) return;

    //         if (this.pageCounter.isCounting) {
    //             this.recount();
    //         } else {
    //             // Get a reference to a visible element
    //             const element = this.getVisibleElement();
    //             if (!element) return this.recount();

    //             this.#shiftToElement({ element });
    //             this.pageCounter.start();
    //         }
    //     },
    //     500,
    //     { trailing: true }
    // );

    disconnectedCallback() {
        this.resizeObserver.disconnect();
        this.bookmarkObserver.disconnect();
        this.focusableObserver.disconnect();
        this.onDisconnect();
    }
}

// ref: https://stackoverflow.com/a/55424778
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace React.JSX {
        interface IntrinsicElements {
            "book-web-component": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & { class?: string },
                HTMLElement
            >;
        }
    }
}

window.customElements.define("book-web-component", BookWebComponent);
