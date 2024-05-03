import debounce from "lodash/debounce";

import PageCounter from "./components/PageCounter";
import StyleLoader from "./components/StyleLoader";
import BookmarkManager from "./components/BookmarkManager";
import StateManager from "./components/StateManager";
import { template } from "./components/Template";
import { BookContent, BookContentState, BookMetadata } from "~/renderer/stores";
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
    uiStateUpdate: Event & { detail: UiState };
    tocStateUpdate: Event & { detail: TocState };
    contextMenuEvent: MouseEvent & {
        detail: {
            e: MouseEvent;
            startElement: ParentNode;
            startElementSelectedText: string;
            selectedText: string;
        };
    };
}

interface VisibleContentElem {
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
    private bookmarkObserver: IntersectionObserver;
    private bookmarkElem: VisibleContentElem = {
        element: null,
        intersectionRatio: null,
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
        // this.bookmarkManager = new BookmarkManager(this);
        this.styleLoader = new StyleLoader(this.styleElem);
        this.state = new StateManager(this);

        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this.rootElem);

        this.bookmarkObserver = new IntersectionObserver((entries) => {
            entries.forEach(
                (entry) => {
                    const isVisible = entry.isIntersecting;
                    if (!isVisible) return;

                    if (this.bookmarkElem.intersectionRatio < entry.intersectionRatio) {
                        this.setVisibleContentElem(entry.intersectionRatio, entry.target);
                    }
                }
                // { threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] }
                // { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
            );
        });

        if (isDev()) {
            // @ts-ignore
            window["bookWebComponent"] = this;
        }
    }

    private setVisibleContentElem(intersectionRatio: number, element = this.bookmarkElem.element) {
        const prevElem = this.bookmarkElem;
        const nextElem = { element, intersectionRatio };
        this.bookmarkElem = nextElem;

        this.onVisibleContentElemChange(prevElem, nextElem);
    }

    private onVisibleContentElemChange(prevElem: VisibleContentElem, nextElem: VisibleContentElem) {
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
            // @ts-ignore
            window["visibleContentElem"] = this.bookmarkElem;
        }
    }

    private updateBookmarkObserver() {
        this.bookmarkObserver.disconnect();
        this.setVisibleContentElem(null);

        const contentChildren = [...this.contentElem.children];
        contentChildren.forEach((childElem) => this.bookmarkObserver.observe(childElem));
    }

    private onSectionLoad(currentPos: Position) {
        console.log("onSectionLoad");
        this.navigateToPosition(currentPos);

        this.emitTocState({
            currentSectionName: this.currentSectionName,
            sectionNames: this.book.sectionNames,
            currentSection: this.state.book.currentSection,
            currentSectionTitle: this.state.section.title,
        });
        this.setVisibleContentElem(null, null);
    }

    async onResize() {
        console.log("onResize");
        const { element } = this.bookmarkElem;

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
        const uiState = this.getBookUiState();
        this.emitUiState(uiState);
        this.updateBookmarkObserver();
        this.updateFocusableElementsVisibility();

        // this.bookmarkManager.emitSaveBookmarks();
    }

    /**
     * Hides links' on another pages so they can't be navigated to with keyboard without flipping the page
     *
     * TODO improve with https://stackoverflow.com/a/1600194
     * and https://stackoverflow.com/a/30753870
     *
     * TODO what if the half of the link is on one page and the other half on another?
     * Will it screw up the offset on tabbing? https://stackoverflow.com/a/36603605
     *
     */
    private updateFocusableElementsVisibility() {
        // const anchors = this.shadowRoot.querySelectorAll("a");
        // anchors.forEach((a) => {
        //     const [_, isAtLeastPartiallyVisible] = this.checkVisibilities(a);
        //     if (isAtLeastPartiallyVisible) {
        //         a.style.visibility = "initial";
        //         // a.removeAttribute("tabindex");
        //     } else {
        //         a.style.visibility = "hidden";
        //         // a.setAttribute("tabindex", "-1");
        //     }
        // });

        console.log("focusableElements", this.focusableElements);
    }

    /**
     * Returns list of elements that can be tabbed onto
     */
    private get focusableElements() {
        return [
            ...this.contentElem.querySelectorAll(
                'a, input, button, select, textarea, [tabindex]:not([tabindex="-1"])'
            ),
        ];
    }

    get totalSections() {
        return this.book.sectionNames.length;
    }

    loadBook(contentState: BookContentState, content: BookContent, metadata: BookMetadata) {
        const { initSectionIndex } = contentState;
        const isInitialLoad = !this.book;

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

        // console.log("loadSection>", sectionIndex, mergedPosition);
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
        const elems = this.contentElem.querySelectorAll("*");

        elems.forEach((elem) => {
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
        e.preventDefault();
        const target = e.currentTarget as HTMLAnchorElement;
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
            let imgContainer = imgElement.parentNode as HTMLElement;
            while (imgContainer !== this.contentElem && imgContainer.children.length === 1) {
                imgContainer.style.display = "flex";
                imgContainer.style.justifyContent = "center";
                imgContainer.style.alignItems = "center";
                imgContainer.style.height = "100%";
                imgContainer.style.margin = "auto";

                imgContainer = imgContainer.parentNode as HTMLElement;
            }
        }
    }

    /**
     * Emits "imgClickEvent" for when the img tag is clicked
     */
    private emitImgClickEvent(e: MouseEvent) {
        const target = e.target as HTMLImageElement;
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
            element = this.shadowRoot.querySelector(elementSelector);
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
     * Emits "uiStateUpdate"
     */
    private emitUiState(uiState: UiState) {
        const uiStateUpdateEvent = new CustomEvent("uiStateUpdate", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: uiState,
        });

        this.dispatchEvent(uiStateUpdateEvent);
    }
    /**
     * Emits "tocStateUpdate"
     */
    private emitTocState(tocState: TocState) {
        const tocStateUpdateEvent = new CustomEvent("tocStateUpdate", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: tocState,
        });

        this.dispatchEvent(tocStateUpdateEvent);
    }

    // /**
    //  * Checks visibility of the element
    //  */
    // private checkVisibilities(elem: HTMLElement) {
    //     const { currentOffset, displayWidth, columnGap } = this;

    //     const elemOffset = this.getElementOffset(elem);
    //     const elemWidth = elem.getBoundingClientRect().width;

    //     const elemStart = elemOffset;
    //     const elemEnd = elemOffset + elemWidth + columnGap;
    //     const visibleStart = currentOffset;
    //     const visibleEnd = currentOffset + displayWidth;

    //     const isFullyVisible = elemStart >= visibleStart && elemEnd <= visibleEnd;

    //     const partialVisibleStart = visibleStart - elemWidth - columnGap;
    //     const partialVisibleEnd = visibleEnd + elemWidth + columnGap;

    //     const isAtLeastPartiallyVisible =
    //         elemStart > partialVisibleStart && elemEnd < partialVisibleEnd;
    //     return [isFullyVisible, isAtLeastPartiallyVisible];
    // }

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
        const allElems = this.contentElem.querySelectorAll("*");
        return allElems[index] as HTMLElement;
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

    // /**
    //  * Recalculates content translate position and total pages
    //  */
    // resize() {
    //     // this.recount();
    // }

    disconnectedCallback() {
        // Cancel debounces
        // this.recount.cancel();
        // this.bookmarkManager.emitSaveBookmarks.cancel();
    }
}

window.customElements.define("book-web-component", BookWebComponent);
