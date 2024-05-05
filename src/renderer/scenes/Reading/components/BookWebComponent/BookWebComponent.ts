import debounce from "lodash/debounce";

import PageCounter from "./components/PageCounter";
import StyleLoader from "./components/StyleLoader";
import BookmarkManager from "./components/BookmarkManager";
import StateManager from "./components/StateManager";
import { template } from "./components/Template";
import { BookContent, BookContentState, BookMetadata, Bookmark } from "~/renderer/stores";
import { isDev } from "~/common/helpers";

type Position = {
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
export interface BookWebComponentEventMap extends HTMLElementEventMap {
    imgClickEvent: MouseEvent;
    uiStateUpdateEvent: Event & { detail: UiState };
    tocStateUpdateEvent: Event & { detail: TocState };
    contextMenuEvent: MouseEvent & {
        detail: {
            e: MouseEvent;
            startElement: ParentNode;
            startElementSelectedText: string;
            selectedText: string;
        };
    };

    autobookmarkPositionEvent: Event & {
        detail: { bookmark: Bookmark };
    };
}

interface BookmarkableContentElement {
    element: Element | null;
    intersectionRatio: number | null;
}

/**
 * Book web component
 */
export default class BookWebComponent extends HTMLElement {
    private book: Book;
    private rootElem: HTMLElement;
    private contentElem: HTMLElement;
    private styleElem: HTMLElement;
    private componentStyle: CSSStyleDeclaration;
    private styleLoader: StyleLoader;
    private state: StateManager;
    private resizeObserver: ResizeObserver;
    /**
     * Updates `bookmarkElem`, which is used to keep track of the first visible content element
     * as a "current position", therefore negating influence of page width
     */
    private bookmarkObserver: IntersectionObserver;
    private bookmarkableElement: BookmarkableContentElement = {
        element: null,
        intersectionRatio: null,
    };
    /**
     * Hides focusabel elements (mainly links) on another pages so they can't be tabbed onto without being visible
     */
    private focusableObserver: IntersectionObserver;

    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.rootElem = this.shadowRoot.getElementById("root");
        this.contentElem = this.shadowRoot.getElementById("book-content");
        this.styleElem = this.shadowRoot.getElementById("book-style");

        this.componentStyle = getComputedStyle(this.rootElem);

        // this.pageCounter = new PageCounter(this);
        // this.bookmarkManager = new BookmarkManager(this);
        this.styleLoader = new StyleLoader(this.styleElem);
        this.state = new StateManager(this);

        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this.rootElem);

        this.bookmarkObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const isVisible = entry.isIntersecting;
                if (!isVisible) return;

                if (this.bookmarkableElement.intersectionRatio < entry.intersectionRatio) {
                    this.setBookmarkableElement(entry.intersectionRatio, entry.target);
                }
            });
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
    }

    /**
     * Emits "autobookmarkPositionEvent" with a new or updated bookmark
     */
    emitAutobookmarkPosition() {
        const elementSection = this.state.book.currentSection;
        const elementIndex = this.contentChildren.indexOf(this.bookmarkableElement.element);

        const bookmarkEvent = new CustomEvent("autobookmarkPositionEvent", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {
                bookmark: { elementIndex, elementSection },
            },
        });

        this.dispatchEvent(bookmarkEvent);
    }

    private setBookmarkableElement(
        intersectionRatio: number,
        element = this.bookmarkableElement.element
    ) {
        const prevElem = this.bookmarkableElement;
        const nextElem = { element, intersectionRatio };
        this.bookmarkableElement = nextElem;

        this.onBookmarkableElemChange(prevElem, nextElem);
    }

    private onBookmarkableElemChange(
        prevElem: BookmarkableContentElement,
        nextElem: BookmarkableContentElement
    ) {
        // TODO make a debug setting within UI
        if (isDev()) {
            if (prevElem.element instanceof HTMLElement) {
                prevElem.element.style.outline = "";
                prevElem.element.style.outlineOffset = "";
            }
            if (nextElem.element instanceof HTMLElement) {
                nextElem.element.style.outline = "3px solid pink";
                nextElem.element.style.outlineOffset = "-3px";
            }
        }

        this.emitAutobookmarkPosition();
    }
    private updateObservers() {
        this.updateBookmarkObserver();
        this.updateFocusableObserver();
    }

    private updateBookmarkObserver() {
        this.bookmarkObserver.disconnect();
        this.setBookmarkableElement(null);

        this.contentChildren.forEach((childElem) => this.bookmarkObserver.observe(childElem));
    }

    private updateFocusableObserver() {
        this.focusableObserver.disconnect();
        this.focusableElements.forEach((focusableElem) =>
            this.focusableObserver.observe(focusableElem)
        );
    }

    private onSectionLoad(currentPos: Position) {
        console.log("onSectionLoad");
        this.setBookmarkableElement(null, null);
        this.navigateToPosition(currentPos);

        this.emitTocState({
            currentSectionName: this.currentSectionName,
            sectionNames: this.book.sectionNames,
            currentSection: this.state.book.currentSection,
            currentSectionTitle: this.state.section.title,
        });
    }

    async onResize() {
        console.log("onResize");
        const { element } = this.bookmarkableElement;

        if (element instanceof HTMLElement) this.shiftToElement({ element }, null);
        else {
            const offset = this.getPageEdgeOffset(this.currentOffset);
            this.setOffset(offset, null);
        }

        const uiState = this.getBookUiState();
        this.emitUiState(uiState);
    }

    async onSectionShift() {
        console.log("onSectionShift");
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

    private get contentChildren() {
        return [...this.contentElem.children];
    }

    get totalSections() {
        return this.book.sectionNames.length;
    }

    loadBook(contentState: BookContentState, content: BookContent, metadata: BookMetadata) {
        const { initSectionIndex } = contentState;
        const isInitialLoad = !this.book;
        console.log("isInitialLoad", isInitialLoad, initSectionIndex, contentState, content);

        if (isInitialLoad) {
            this.book = { ...content, sectionNames: contentState.sectionNames, metadata };
            this.loadSection(initSectionIndex);
            this.state.setInitBookInfo(this.book.sectionNames.length);
        } else {
            this.book = { ...content, sectionNames: contentState.sectionNames, metadata };
        }
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
    private loadSection(sectionIndex: number, position?: Position) {
        const currentPos = { ...this.initPosition, ...position };

        const sectionContent = this.getSection(sectionIndex);
        if (!sectionContent) return;

        this.state.updateState(this.book, sectionIndex);
        // this.styleLoader.loadStyles(this.book.styles, sectionContent);
        this.loadContent(sectionContent);

        console.log("loadSection>", sectionIndex, currentPos);
        // console.log("book>", sectionIndex, mergedPosition, this.book.sectionNames[sectionIndex]);

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
        this.processContentElements();
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

    private processContentElements() {
        this.contentChildren.forEach((elem) => {
            elem.addEventListener("contextmenu", (e: MouseEvent) => {
                // @ts-ignore
                const selection: Selection = this.shadowRoot.getSelection();

                const selectedText = selection.toString();

                const range = selection.getRangeAt(0);
                const startElement = range.startContainer.parentNode;
                const [startElementSelectedText] = selectedText.split("\n");

                if (startElement && startElementSelectedText) {
                    e.stopPropagation();
                    this.emitContextMenuEvent(
                        e,
                        startElement,
                        startElementSelectedText,
                        selectedText
                    );
                }
            });
        });
    }

    private emitContextMenuEvent(
        e: MouseEvent,
        startElement: ParentNode,
        startElementSelectedText: string,
        selectedText: string
    ) {
        const contextMenuEvent = new CustomEvent("contextMenuEvent", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: { event: e, startElement, startElementSelectedText, selectedText },
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

        const isLinkValid = this.navToLink(sectionName, markerId);

        // Opens link in external browser
        if (!isLinkValid && target.href) window.open(target.href, "_blank");
    }

    navToLink(sectionId: string, markerId?: string) {
        const sectionIndex = this.book.sectionNames.findIndex(
            (sectionName) => sectionName === sectionId
        );
        const isLinkValid = sectionIndex !== -1;

        if (isLinkValid) {
            const position = { markerId };

            if (this.state.book.currentSection === sectionIndex) this.navigateToPosition(position);
            else this.loadSection(sectionIndex, position);
        }

        return isLinkValid;
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

        const imgClickEvent = new CustomEvent("imgClickEvent", {
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

    /**
     * Flips specified amout of pages forward or backwards
     */
    flipNPages(n: number) {
        if (n === 0 || !this.book) return;

        const { firstPage: firstSectionPage, lastPage: lastSectionPage } = this.state.section;
        const currentSectionPage = this.state.section.currentPage;
        const requestedSectionPage = currentSectionPage + n;

        const firstSection = 0;
        const lastSection = this.totalSections - 1;
        const { currentSection } = this.state.book;
        const nextSection = currentSection + 1;
        const prevSection = currentSection - 1;

        // console.log("section", firstSection, "-", lastSection, `(current ${currentSection})`);
        // console.log(
        //     "section page",
        //     firstSectionPage,
        //     "-",
        //     lastSectionPage,
        //     `(current ${currentPage})`
        // );
        // console.log("REQUESTED", requestedSectionPage);
        // console.log("");

        const doesNextSectionExist = nextSection <= lastSection;
        const doesPrevSectionExist = prevSection >= firstSection;

        const didRequestSucceedingSection = requestedSectionPage > lastSectionPage;
        const didRequestPreceedingSection = requestedSectionPage < firstSectionPage;
        const didRequestThisSection = !didRequestPreceedingSection && !didRequestSucceedingSection;

        // console.log("doesNextSectionExist", doesNextSectionExist);
        // console.log("doesPrevSectionExist", doesPrevSectionExist);
        // console.log("didRequestSucceedingSection", didRequestSucceedingSection);
        // console.log("didRequestPreceedingSection", didRequestPreceedingSection);
        // console.log("didRequestThisSection", didRequestThisSection);
        // console.log("");

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

    private navigateToPosition({ sectionPage, elementIndex, elementSelector }: Position) {
        if (elementSelector || elementIndex) {
            this.shiftToElement({ elementIndex, elementSelector });
        } else if (!sectionPage.isFromBack) {
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

        // this.bookmarkManager.emitSaveBookmarks();
    }

    /**
     * Shifts offset to the page with the given element.
     * Element can be passed either by `elementIndex`, `elementSelector` or `element`.
     * The `elementIndex` is given precedence over `elementSelector`,
     * and `elementSelector` is given precedence over `element`.
     */
    private shiftToElement(
        { element, elementIndex, elementSelector }: Position,
        callback = () => this.onSectionShift()
    ) {
        if (elementIndex) {
            element = this.getElementByIndex(elementIndex);
        } else if (elementSelector) {
            element = this.contentElem.querySelector(elementSelector);
        }

        if (element) {
            const targetOffset = this.getElementOffset(element);

            this.setOffset(targetOffset, callback);
        } else {
            throw new Error("Couldn't find specified element");
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
        };

        return uiState;
    }

    /**
     * Emits "uiStateUpdateEvent"
     */
    private emitUiState(uiState: UiState) {
        const uiStateUpdateEvent = new CustomEvent("uiStateUpdateEvent", {
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
        const tocStateUpdateEvent = new CustomEvent("tocStateUpdateEvent", {
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
     * @returns {number}
     */
    getElementOffset(elem: HTMLElement, roundToEdge = true) {
        if (!elem) throw new Error("Cannot get element offset: elem is not provided.");

        const elemOffset = elem.offsetLeft;
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
    private setOffset(nextOffset: string | number, callback = () => this.onSectionShift()) {
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
        //@ts-ignore
        window["displayWidth"] = displayWidth;
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

        //@ts-ignore
        window["approximateTotalWidth"] = approximateTotalWidth;
        //@ts-ignore
        window["totalWidth"] = totalWidth;
        //@ts-ignore
        window["currentWidth"] = this.currentOffset;

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
        // Cancel debounces
        // this.recount.cancel();
        // this.bookmarkManager.emitSaveBookmarks.cancel();
    }
}

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
