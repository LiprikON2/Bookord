import debounce from "lodash/debounce";

import PageCounter from "./components/PageCounter";
import BookLoader from "./components/BookLoader";
import BookmarkManager from "./components/BookmarkManager";
import StateManager from "./components/StateManager";
import { template } from "./components/Template";
import { BookContent, BookContentState, BookMetadata } from "~/renderer/stores";

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

export interface BookWebComponentEventMap extends HTMLElementEventMap {
    imgClickEvent: MouseEvent;
    uiStateUpdate: Event & { detail: UiState };
}

/**
 * Book web component
 */
export default class BookWebComponent extends HTMLElement {
    rootElem: HTMLElement;
    contentElem: HTMLElement;
    componentStyle: CSSStyleDeclaration;
    bookLoader: BookLoader;
    stateManager: StateManager;
    book: Book;

    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.rootElem = this.shadowRoot.getElementById("root");
        this.contentElem = this.shadowRoot.getElementById("book-content");

        this.componentStyle = getComputedStyle(this.rootElem);

        // this.pageCounter = new PageCounter(this);
        this.bookLoader = new BookLoader(this);
        // this.bookmarkManager = new BookmarkManager(this);
        this.stateManager = new StateManager(this);

        // this.isQuitting = false;
        // this.pageTopMostElem = null;

        // this.intersectionObserver = new IntersectionObserver(
        //     // Iterates from back over direct content children and picks out the child
        //     // which is the most visible and is close to the beginning of the page
        //     (entries, observer) => {
        //         if (entries?.[0]?.target) {
        //             this.pageTopMostElem = entries[0].target;
        //         }

        //         // let newTopMostElem = null;
        //         // // const prevTopMostRatio = this.pageTopMostElem?.intersectionRatio ?? 0;
        //         // // forEach-like iteration in reverse order

        //         //     entries.reduceRight((_, entry, i) => {
        //         //         // if (entry.intersectionRatio >= 0.01 && prevTopMostRatio !== 0.25) {
        //         //         //     newTopMostElem = entry;
        //         //         // } else if (
        //         //         //     entry.intersectionRatio >= 0.25 &&
        //         //         //     prevTopMostRatio !== 0.5
        //         //         // ) {
        //         //         //     newTopMostElem = entry;
        //         //         // } else if (
        //         //         //     entry.intersectionRatio >= 0.5 &&
        //         //         //     prevTopMostRatio !== 0.75
        //         //         // ) {
        //         //         //     newTopMostElem = entry;
        //         //         // } else if (
        //         //         //     entry.intersectionRatio >= 0.75 &&
        //         //         //     prevTopMostRatio !== 1
        //         //         // ) {
        //         //         //     newTopMostElem = entry;
        //         //         // } else if (entry.intersectionRatio >= 1) {
        //         //         //     newTopMostElem = entry;
        //         //         // }
        //         //         return null;
        //         //     }, null);
        //         // if (newTopMostElem) this.pageTopMostElem = newTopMostElem;
        //     },
        //     {
        //         threshold: 0.01,
        //     }
        // );
        // // Recount book pages every time bookComponent's viewport changes
        // new ResizeObserver(() => this.resize()).observe(this.rootElem);
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
            this.stateManager.setInitBookInfo(this.book.sectionNames.length);
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

    /**
     * Loads specified book section along with its styles, sets event listeners, updates UI and saves interaction progress
     */
    loadSection(sectionIndex: number, position?: Position) {
        const mergedPosition = { ...this.initPosition, ...position };

        console.log("loadSection>", sectionIndex, mergedPosition);

        const sectionContent = this.getSection(sectionIndex);
        if (!sectionContent) return;

        this.stateManager.updateState(this.book, sectionIndex);

        console.log("book>", sectionIndex, mergedPosition, this.book.sectionNames[sectionIndex]);

        // this.bookLoader.loadStyles(this.book.styles, sectionContent);
        this.loadContent(sectionContent);

        this.navigateToPosition(mergedPosition);
        // this.updateObserver();
    }

    /**
     * Loads book's content and appends a end-marker to it
     */
    loadContent(sectionContent: ArrayElement<Book["sections"]>["content"]) {
        this.contentElem.innerHTML = "";
        // Remove head tag from section
        const headlessSectionContent = sectionContent.slice(1);
        this.recCreateElements(this.contentElem, headlessSectionContent);

        this.processContentImages();
        this.processContentLinks();
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

        const { firstPage: firstSectionPage, lastPage: lastSectionPage } =
            this.stateManager.section;
        const currentPage = this.stateManager.getCurrentSectionPage();
        const requestedSectionPage = currentPage + n;

        const firstSection = 0;
        const lastSection = this.totalSections - 1;
        const { currentSection } = this.stateManager.book;
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
                const nextSectionPage = n - 1 - (lastSectionPage - currentPage);
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
                const prevSectionPage = n + 1 - (firstSectionPage - currentPage);
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
        this.flipNSections(1);
    }

    /**
     * Flips one section backward
     */
    sectionBackward() {
        this.flipNSections(-1);
    }

    /**
     * Flips specified amout of sections forward or backward
     */
    flipNSections(n: number) {
        if (!this.book) return;
        const { currentSection } = this.stateManager.book;
        this.shiftToSection(currentSection + n);
    }

    /**
     * Flips N pages of a book if they are within the section
     */
    private shiftToSectionPage(page: number) {
        const displayWidth = this.displayWidth;
        const newOffset = page * displayWidth;

        this.setOffset(newOffset);
    }

    private shiftToSection(sectionNum: number) {
        const { currentSection } = this.stateManager.book;

        const targetSection = Math.max(0, Math.min(sectionNum, this.totalSections - 1));
        const isFromBack = currentSection > targetSection;

        if (targetSection === currentSection) return;
        this.loadSection(targetSection, { sectionPage: { value: 0, isFromBack } });
    }

    // /**
    //  * TODO
    //  */
    // updateObserver() {
    //     this.intersectionObserver.disconnect();

    //     const elements = this.contentElem.children;
    //     [...elements].forEach((element) => {
    //         this.intersectionObserver.observe(element);
    //     });
    // }

    // /**
    //  * Returns currently fully visible or at least partially visible element
    //  * @returns {Element}
    //  */
    // getVisibleElement() {
    //     return this.pageTopMostElem;
    // }

    private navigateToPosition({ sectionPage, elementIndex, elementSelector }: Position) {
        if (elementSelector || elementIndex) {
            this.shiftToElement({ elementIndex, elementSelector });
        } else if (!sectionPage.isFromBack) {
            const { firstPage } = this.stateManager.section;
            this.shiftToSectionPage(firstPage);

            const targetPage = sectionPage.value;
            this.flipNPages(targetPage);
        } else if (sectionPage.isFromBack) {
            const { lastPage } = this.stateManager.section;
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
    private shiftToElement({ element, elementIndex, elementSelector }: Position) {
        if (elementIndex) {
            element = this.getElementByIndex(elementIndex);
        } else if (elementSelector) {
            element = this.shadowRoot.querySelector(elementSelector);
        }

        if (element) {
            const targetOffset = this.getElementOffset(element);
            this.setOffset(targetOffset);
        } else {
            throw new Error("Couldn't find specified element");
        }
    }

    /**
     * Returns book's section object
     */
    getSection(sectionIndex: number) {
        if (sectionIndex > this.book.sections.length - 1 || sectionIndex < 0) {
            throw new Error("Requested section is out of range.");
        }
        return this.book.sections[sectionIndex]?.content;
    }

    /**
     * Handles clicks on book navigation links and website links
     */
    handleLink(e: Event) {
        e.preventDefault();
        const target = e.currentTarget as HTMLAnchorElement;
        let [sectionId, markerId] = target.href.split("#").pop().split(",");
        markerId = "#" + markerId;

        const isLinkValid = this.navToLink(sectionId, markerId);

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

            this.loadSection(sectionIndex, position);
        }

        return isLinkValid;
    }

    /**
     * Updates book's UI elements such as book title, section title and page counters
     */
    updateBookUi() {
        const currentSectionPage = this.stateManager.getCurrentSectionPage();
        const totalSectionPages = this.countSectionPages();

        const currentBookPage = this.stateManager.getCurrentBookPage();
        const totalBookPages = this.stateManager.getTotalBookPages();

        const uiState = {
            currentSectionTitle: this.stateManager.section.title,
            currentSectionPage,
            totalSectionPages,
            currentBookPage,
            totalBookPages,
        };
        this.emitUiStateUpdate(uiState);
    }

    /**
     * Emits "uiStateUpdate"
     */
    emitUiStateUpdate(uiState: UiState) {
        const uiStateUpdateEvent = new CustomEvent("uiStateUpdate", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: uiState,
        });

        this.dispatchEvent(uiStateUpdateEvent);
    }

    /**
     * Attaches event handlers to anchor tags to handle book navigation
     */
    processContentLinks() {
        const anchors = this.shadowRoot.querySelectorAll("a");
        anchors.forEach((a) => {
            a.addEventListener("click", (e) => this.handleLink(e));
        });
    }

    /**
     * Checks visibility of the element
     */
    checkVisibilities(elem: HTMLElement) {
        const { currentOffset, displayWidth, columnGap } = this;

        const elemOffset = this.getElementOffset(elem);
        const elemWidth = elem.getBoundingClientRect().width;

        const elemStart = elemOffset;
        const elemEnd = elemOffset + elemWidth + columnGap;
        const visibleStart = currentOffset;
        const visibleEnd = currentOffset + displayWidth;

        const isFullyVisible = elemStart >= visibleStart && elemEnd <= visibleEnd;

        const partialVisibleStart = visibleStart - elemWidth - columnGap;
        const partialVisibleEnd = visibleEnd + elemWidth + columnGap;

        const isAtLeastPartiallyVisible =
            elemStart > partialVisibleStart && elemEnd < partialVisibleEnd;
        return [isFullyVisible, isAtLeastPartiallyVisible];
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
    private hideInvisibleLinks() {
        const anchors = this.shadowRoot.querySelectorAll("a");
        anchors.forEach((a) => {
            const [_, isAtLeastPartiallyVisible] = this.checkVisibilities(a);
            if (isAtLeastPartiallyVisible) {
                a.style.visibility = "initial";
                // a.removeAttribute("tabindex");
            } else {
                a.style.visibility = "hidden";
                // a.setAttribute("tabindex", "-1");
            }
        });
    }

    /**
     * Returns element's offset
     * @param {HTMLElement} elem
     * @param {boolean} [round] - rounds elements offset to the left page edge
     * @returns {number}
     */
    getElementOffset(elem: HTMLElement, round = true) {
        if (!elem) throw new Error("Cannot get element offset: elem is not provided.");

        const elemOffset = elem.offsetLeft;
        if (!round) {
            return elemOffset;
        }

        const { displayWidth, columnGap } = this;

        let width = 0;
        while (width - columnGap < elemOffset) {
            width += displayWidth;
        }
        const leftEdge = width - displayWidth;
        return leftEdge;
    }

    /**
     * Sets pixel offset as a way to advance pages within a section
     */
    private setOffset(nextOffset: string | number) {
        this.contentElem.style.transform = `translate(-${nextOffset}px)`;
        // this.#hideInvisibleLinks(); // todo fix
        this.updateBookUi();
        // this.bookmarkManager.emitSaveBookmarks();
    }

    get currentOffset() {
        // Strips all non-numeric characters from a string
        const currentOffset = parseInt(this.contentElem.style.transform.replace(/[^\d.-]/g, ""));
        return isNaN(currentOffset) ? 0 : Math.abs(currentOffset);
    }

    /**
     * Returns book content's width
     * @returns {number} - a positive number
     */
    get displayWidth() {
        return this.contentElem.offsetWidth + this.columnGap;
    }

    /**
     * Returns offset to the right edge of content
     * @returns {number} - a positive number of pixels
     */
    get totalDisplayWidth() {
        const columnGap = this.componentStyle.getPropertyValue("--column-gap");
        const totalWidth = this.contentElem.scrollWidth + parseInt(columnGap);

        return totalWidth;
    }

    /**
     * Returns the invisible column gap between the pages in pixels
     * @returns {number}
     */
    get columnGap() {
        return parseInt(this.componentStyle.getPropertyValue("--column-gap"));
    }

    /**
     * Returns the total amount of pages in section
     * @returns {number}
     */
    countSectionPages() {
        const totalWidth = this.totalDisplayWidth;
        const width = this.displayWidth;

        const sectionPages = totalWidth / width;
        const rounded = Math.round(sectionPages);
        if (Math.abs(rounded - sectionPages) > 0.01)
            console.log("Warning. countSectionPages rounding error", rounded, sectionPages);
        return rounded;
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
    getElementByIndex(index: number) {
        const allElems = this.contentElem.querySelectorAll("*");
        return allElems[index] as HTMLElement;
    }

    /**
     * Emits "saveBookmarksEvent" when the book is fully parsed
     */
    emitSaveParsedBook() {
        const saveParsedBookEvent = new CustomEvent("saveParsedBookEvent", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: { parsedBook: this.book },
        });

        this.dispatchEvent(saveParsedBookEvent);
    }

    /**
     * Attaches event emitter to img tags to handle open modals on click
     */
    processContentImages() {
        const images = this.shadowRoot.querySelectorAll("img");

        images.forEach((img) => {
            img.addEventListener("click", this.emitImgClickEvent);
            this.applyCenteringStyles(img);
        });
    }

    /**
     * Makes div parents (up to contentElem) of the provided image tag to center their content
     */
    applyCenteringStyles(imgElement: HTMLImageElement) {
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
    emitImgClickEvent(e: MouseEvent) {
        const target = e.target as HTMLImageElement;
        const imgClickEvent = new CustomEvent("imgClickEvent", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: { src: target.src },
        });

        this.dispatchEvent(imgClickEvent);
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
