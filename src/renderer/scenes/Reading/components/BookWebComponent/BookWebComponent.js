//@ts-check

import debounce from "lodash/debounce";

import PageCounter from "./components/PageCounter";
import BookLoader from "./components/BookLoader";
import BookmarkManager from "./components/BookmarkManager";
import StateManager from "./components/StateManager";
import { template } from "./components/Template";

/**
 * Book web component
 */
export default class BookWebComponent extends HTMLElement {
    // Listen for changes in the book-page attribute
    static get observedAttributes() {
        return ["book-page"];
    }

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
        this.book = null;

        this.isQuitting = false;
        this.settings = {
            enlargeImages: true,
        };
        this.pageTopMostElem = null;

        this.intersectionObserver = new IntersectionObserver(
            // Iterates from back over direct content children and picks out the child
            // which is the most visible and is close to the beginning of the page
            (entries, observer) => {
                if (entries?.[0]?.target) {
                    this.pageTopMostElem = entries[0].target;
                }

                // let newTopMostElem = null;
                // // const prevTopMostRatio = this.pageTopMostElem?.intersectionRatio ?? 0;
                // // forEach-like iteration in reverse order

                //     entries.reduceRight((_, entry, i) => {
                //         // if (entry.intersectionRatio >= 0.01 && prevTopMostRatio !== 0.25) {
                //         //     newTopMostElem = entry;
                //         // } else if (
                //         //     entry.intersectionRatio >= 0.25 &&
                //         //     prevTopMostRatio !== 0.5
                //         // ) {
                //         //     newTopMostElem = entry;
                //         // } else if (
                //         //     entry.intersectionRatio >= 0.5 &&
                //         //     prevTopMostRatio !== 0.75
                //         // ) {
                //         //     newTopMostElem = entry;
                //         // } else if (
                //         //     entry.intersectionRatio >= 0.75 &&
                //         //     prevTopMostRatio !== 1
                //         // ) {
                //         //     newTopMostElem = entry;
                //         // } else if (entry.intersectionRatio >= 1) {
                //         //     newTopMostElem = entry;
                //         // }
                //         return null;
                //     }, null);
                // if (newTopMostElem) this.pageTopMostElem = newTopMostElem;
            },
            {
                threshold: 0.01,
            }
        );
        // Recount book pages every time bookComponent's viewport changes
        new ResizeObserver(() => this.resize()).observe(this.rootElem);
    }

    get totalSections() {
        return this.book.sectionNames.length;
    }

    //@ts-ignore
    loadBook(contentState, content, metadata) {
        const { initSectionIndex } = contentState;
        const isInitialLoad = !this.book;

        if (isInitialLoad) {
            this.book = { ...content, sectionNames: contentState.sectionNames, metadata };
            this.loadSection(initSectionIndex);
            this.stateManager.setInitBookInfo(this.book.sectionNames.length, metadata.title);
        } else {
            this.book = { ...content, sectionNames: contentState.sectionNames, metadata };
        }
    }

    /**
     * Loads specified book section along with its styles, sets event listeners, updates UI and saves interaction progress
     * @param {number} sectionIndex - section number
     *
     * @param {Object} [position]
     * @param {Object} [position.sectionPage]
     * @param {number} position.sectionPage.value
     * @param {boolean} position.sectionPage.isFromBack
     *
     * @param {number} [position.elementIndex]
     * @param {string} [position.elementSelector]
     * @param {string} [position.markerId]
     * @returns {Promise<void>}
     */
    async loadSection(sectionIndex, position) {
        console.log("loadSection", sectionIndex, position);
        /** @type {any} */
        const defaults = {
            sectionPage: { value: 0, isFromBack: false },
            elementIndex: null,
            elementSelector: "",
        };
        const pos = { ...defaults, ...position };

        // let book, section;
        // if (this.status === "loading") {
        //     book = await this.initBook;
        //     this.status = "sectionReady";

        //     section = book.initSection;
        //     sectionIndex = book.initSectionIndex;
        // } else {
        //     book = await this.book;
        //     section = this.getSection(book, sectionIndex);
        // }
        const sectionContent = this.getSection(sectionIndex);
        if (!sectionContent) return;

        this.stateManager.updateState(this.book, sectionIndex);

        console.log("book", sectionIndex, pos, this.book.sectionNames[sectionIndex]);

        // this.bookLoader.loadStyles(this.book.styles, sectionContent);
        this.bookLoader.loadContent(sectionContent);

        this.#navigateToPosition(pos);

        // this.attachLinkHandlers(book);
        // this.attachImgEventEmitters();
        // this.updateObserver();
    }

    /**
     * Flips one page forward
     * @returns {void}
     */
    pageForward() {
        this.flipNPages(1);
    }

    /**
     * Flips one page backward
     * @returns {void}
     */
    pageBackward() {
        this.flipNPages(-1);
    }

    /**
     * Flips specified amout of pages forward or backwards
     * @param {number} n - book page
     * @returns {Promise<void>}
     */
    async flipNPages(n) {
        if (n === 0) return;

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
            this.#shiftToSectionPage(requestedSectionPage);
        } else if (didRequestSucceedingSection) {
            if (doesNextSectionExist) {
                const nextSectionPage = n - 1 - (lastSectionPage - currentPage);
                const position = {
                    sectionPage: { value: nextSectionPage, isFromBack: false },
                };
                this.loadSection(nextSection, position);
            } else {
                // Default to the last page
                this.#shiftToSectionPage(lastSectionPage);
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
                this.#shiftToSectionPage(firstSectionPage);
            }
        }
    }

    /**
     * Flips one section forward
     * @returns {void}
     */
    sectionForward() {
        this.flipNSections(1);
    }

    /**
     * Flips one section backward
     * @returns {void}
     */
    sectionBackward() {
        this.flipNSections(-1);
    }

    /**
     * Flips specified amout of sections forward or backward
     * @param {number} n - book section
     */
    flipNSections(n) {
        const { currentSection } = this.stateManager.book;
        this.#shiftToSection(currentSection + n);
    }

    /**
     * Flips N pages of a book if they are within the section
     * @param {number} page
     * @returns {void}
     */
    #shiftToSectionPage(page) {
        const displayWidth = this._getDisplayWidth();
        const newOffset = page * displayWidth;

        this.#setOffset(newOffset);
    }

    /**
     * TODO
     * @param {*} sectionNum
     * @returns
     */
    #shiftToSection(sectionNum) {
        const { currentSection } = this.stateManager.book;

        const targetSection = Math.max(0, Math.min(sectionNum, this.totalSections - 1));
        const isFromBack = currentSection > targetSection;

        this.loadSection(targetSection, { sectionPage: { value: 0, isFromBack } });
    }

    /**
     * TODO
     * @returns {void}
     */
    updateObserver() {
        this.intersectionObserver.disconnect();

        const elements = this.contentElem.children;
        [...elements].forEach((element) => {
            this.intersectionObserver.observe(element);
        });
    }

    /**
     * Returns currently fully visible or at least partially visible element
     * @returns {Element}
     */
    getVisibleElement() {
        return this.pageTopMostElem;
    }

    /**
     * TODO
     * @param {Object} position
     * @param {Object} [position.sectionPage]
     * @param {number} position.sectionPage.value
     * @param {boolean} position.sectionPage.isFromBack
     * @param {number} [position.elementIndex]
     * @param {string} [position.elementSelector]
     * @returns {void}
     */
    #navigateToPosition({ sectionPage, elementIndex, elementSelector }) {
        if (elementSelector || elementIndex) {
            this.#shiftToElement({ elementIndex, elementSelector });
        } else if (!sectionPage.isFromBack) {
            const { firstPage } = this.stateManager.section;
            this.#shiftToSectionPage(firstPage);

            const targetPage = sectionPage.value;
            this.flipNPages(targetPage);
        } else if (sectionPage.isFromBack) {
            const { lastPage } = this.stateManager.section;
            this.#shiftToSectionPage(lastPage);

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
     * @param {Object} elementPosition
     * @param {HTMLElement | Element} [elementPosition.element]
     * @param {number} [elementPosition.elementIndex]
     * @param {string} [elementPosition.elementSelector]
     * @returns {void}
     */
    #shiftToElement({ element, elementIndex, elementSelector }) {
        if (elementIndex) {
            element = this.getElementByIndex(elementIndex);
        } else if (elementSelector) {
            element = this.shadowRoot.querySelector(elementSelector);
        }

        if (element) {
            const targetOffset = this.getElementOffset(element);
            this.#setOffset(targetOffset);
        } else {
            throw new Error("Couldn't find specified element");
        }
    }

    /**
     * Returns book's section object
     * @param {number} sectionIndex
     * @returns {Array<HtmlObject> | null}
     */
    getSection(sectionIndex) {
        if (sectionIndex > this.book.sections.length - 1 || sectionIndex < 0) {
            throw new Error("Requested section is out of range.");
        }
        return this.book.sections[sectionIndex]?.content;
    }

    /**
     * Handles clicks on book navigation links and website links
     * @param {Event} e - Event
     * @param {InitBook | ParsedBook} book
     * @returns {void}
     */
    handleLink(e, book) {
        e.preventDefault();
        /**
         * @type {HTMLAnchorElement | any}
         */
        const target = e.currentTarget;
        let [sectionName, markerId] = target.href.split("#").pop().split(",");
        markerId = "#" + markerId;

        const sectionIndex = book.sectionNames.findIndex((section) => section === sectionName);

        if (sectionIndex !== -1) {
            const position = {
                markerId,
            };

            this.loadSection(sectionIndex, position);
        } else {
            // Opens link in external browser
            if (target.href) {
                window.open(target.href, "_blank");
            }
        }
    }

    /**
     * Updates book's UI elements such as book title, section title and page counters
     * @returns {void}
     */
    updateBookUi() {
        const currentSectionPage = this.stateManager.getCurrentSectionPage();
        const totalSectionPages = this.countSectionPages();

        const currentBookPage = this.stateManager.getCurrentBookPage();
        const totalBookPages = this.stateManager.getTotalBookPages();

        const uiState = {
            bookTitle: this.stateManager.bookTitle,
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
     * @param {UIState} state
     * @listens Event
     * @return {void}
     */
    emitUiStateUpdate(state) {
        const uiStateUpdateEvent = new CustomEvent("uiStateUpdate", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: { state },
        });

        this.dispatchEvent(uiStateUpdateEvent);
    }

    /**
     * Attaches event handlers to anchor tags to handle book navigation
     * @param {InitBook | ParsedBook} book
     * @returns {void}
     */
    attachLinkHandlers(book) {
        const anchors = this.shadowRoot.querySelectorAll("a");
        anchors.forEach((a) => {
            a.addEventListener("click", (e) => {
                this.handleLink(e, book);
            });
        });
    }

    /**
     * Checks visibility of the element
     * @param {HTMLElement | any} elem
     * @returns {boolean[]} [isFullyVisible, isAtLeastPartiallyVisible]
     */
    checkVisibilities(elem) {
        const currentOffset = this._getCurrentOffset();
        const displayWidth = this._getDisplayWidth();
        const columnGap = this._getColumnGap();
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
     * @returns {void}
     */
    #hideInvisibleLinks() {
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
     *
     * TODO set page based on provided element
     *
     * @param {HTMLElement | any} elem
     * @param {boolean} [round] - rounds elements offset to the left page edge
     * @returns {number}
     */
    getElementOffset(elem, round = true) {
        if (!elem) throw new Error("Cannot get element offset: elem is not provided.");
        const elemOffset = elem.offsetLeft;
        if (!round) {
            return elemOffset;
        }

        const displayWidth = this._getDisplayWidth();
        const columnGap = this._getColumnGap();

        let width = 0;
        while (width - columnGap < elemOffset) {
            width += displayWidth;
        }
        const leftEdge = width - displayWidth;
        return leftEdge;
    }

    /**
     * Sets pixel offset as a way to advance pages within a section
     * @param {string | number} nextOffset
     * @returns {void}
     */
    #setOffset(nextOffset) {
        this.contentElem.style.transform = `translate(-${nextOffset}px)`;
        // this.#hideInvisibleLinks(); // todo fix
        this.updateBookUi();
        // this.bookmarkManager.emitSaveBookmarks();
    }

    /**
     * TODO
     * @returns {number}
     */
    _getCurrentOffset() {
        // Strips all non-numeric characters from a string
        const currentOffset = parseInt(this.contentElem.style.transform.replace(/[^\d.-]/g, ""));
        return isNaN(currentOffset) ? 0 : Math.abs(currentOffset);
    }

    // todo as getter
    /**
     * Returns book content's width
     * @returns {number} - a positive number
     */
    _getDisplayWidth() {
        const columnGap = this._getColumnGap();
        return this.contentElem.offsetWidth + columnGap;
    }

    /**
     * Returns offset to the right edge of content
     * @returns {number} - a positive number of pixels
     */
    _getTotalDisplayWidth() {
        const columnGap = this.componentStyle.getPropertyValue("--column-gap");
        const totalWidth = this.contentElem.scrollWidth + parseInt(columnGap);

        return totalWidth;
    }

    /**
     * Returns the invisible column gap between the pages in pixels
     * @returns {number}
     */
    _getColumnGap() {
        return parseInt(this.componentStyle.getPropertyValue("--column-gap"));
    }

    /**
     * Returns the total amount of pages in section
     * @returns {number}
     */
    countSectionPages() {
        const totalWidth = this._getTotalDisplayWidth();
        const width = this._getDisplayWidth();

        const sectionPages = totalWidth / width;
        const rounded = Math.round(sectionPages);
        if (Math.abs(rounded - sectionPages) > 0.01)
            console.log("Warning. countSectionPages rounding error", rounded, sectionPages);
        return rounded;
    }

    /**
     * TODO implement: Jumps straight to the particular book page
     * @param {number} page - book page
     * @returns {void}
     */
    jumpToPage(page) {
        // if (this.status === "loading") return;
        // const validPage = this.#enforcePageRange(page);
        // const currentPage = this.stateManager.getCurrentBookPage();
        // const nPageShift = validPage - currentPage - 1;
        // const nextSection = this.stateManager.getSectionBookPageBelongsTo(validPage);
        // const currentSection = this.stateManager.book.currentSection;
        // // Avoid loading the loaded section again by flipping pages instead
        // if (nextSection === currentSection && nPageShift !== 0) {
        //     this.#shiftToSectionPage(nPageShift);
        // } else if (
        //     nextSection !== currentSection &&
        //     (this.status === "ready" || this.pageCounter.isCounting)
        // ) {
        //     const sectionPagesArr = this.stateManager.sectionPagesArr;
        //     // Prevents the change of a section before the section is counted
        //     if (!this.stateManager.isSectionCounted(nextSection)) {
        //         return;
        //     }
        //     const sumOfPages = this.stateManager._sumFirstNArrayItems(
        //         sectionPagesArr,
        //         nextSection
        //     );
        //     // TODO rename
        //     const totalNextSectionPage = sectionPagesArr[nextSection];
        //     const currentNextSectionPage =
        //         currentPage + nPageShift - sumOfPages + totalNextSectionPage;
        //     this.loadSection(nextSection, currentNextSectionPage);
        // }
    }

    /**
     * Returns page that is guranteed to be withing the borders of a book
     * @param {number} page - book page
     * @returns {number}
     */
    #enforcePageRange(page) {
        const minPage = 1;
        const maxPage = this.stateManager.getTotalBookPages();
        if (page < minPage) {
            page = minPage;
        } else if (page > maxPage) {
            page = maxPage;
        }
        return page;
    }

    /**
     * Returns element by the index of descendant elements of contentElem
     * @param {number} index - index of element
     * @returns {Element}
     */
    getElementByIndex(index) {
        const allElems = this.contentElem.querySelectorAll("*");
        return allElems[index];
    }

    /**
     * Emits "saveBookmarksEvent" when the book is fully parsed
     * @listens Event
     * @return {Promise<void>}
     */
    async emitSaveParsedBook() {
        const saveParsedBookEvent = new CustomEvent("saveParsedBookEvent", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: { parsedBook: this.book },
        });

        this.dispatchEvent(saveParsedBookEvent); // todo uncomment
    }

    /**
     * Attaches event emitter to img tags to handle open modals on click
     * @returns {void}
     */
    attachImgEventEmitters() {
        const images = this.shadowRoot.querySelectorAll("img");

        images.forEach((img) => {
            img.addEventListener("click", (e) =>
                img.addEventListener("click", this.emitImgClickEvent)
            );

            if (this.settings.enlargeImages) this.applyCenteringStyles(img);
        });
    }

    /**
     * Makes div parents (up to contentElem) of the provided image tag to center their content
     * @param {HTMLImageElement | any} imgElement
     */
    applyCenteringStyles(imgElement) {
        const isDecorativeImage =
            imgElement.alt === "" ||
            imgElement.role === "presentation" ||
            imgElement.role === "none";
        if (!isDecorativeImage) {
            let target = imgElement.parentNode;
            while (target !== this.contentElem && target.children.length === 1) {
                console.log("targetting", target.id + target.className, this.contentElem);
                target.style.display = "flex";
                target.style.justifyContent = "center";
                target.style.alignItems = "center";
                target.style.height = "100%";
                target.style.margin = "auto";

                target = target.parentNode;
            }
        }
    }

    /**
     * Emits "imgClickEvent" for when the img tag is clicked
     * @param {Event} e - Event
     * @listens Event
     * @return {void}
     */
    emitImgClickEvent(e) {
        /**
         * @type {HTMLImageElement | any}
         */
        const target = e.target;
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
    //  * @type {_.DebouncedFunc<() => void>}
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
    /**
     * Recalculates content translate position and total pages
     */
    resize() {
        // this.recount();
    }

    disconnectedCallback() {
        // @ts-ignore
        if (this.unlisten) this.unlisten();
        this.isQuitting = true;

        // TODO terminate recounting properly
        // TODO call quit on all classes

        // Cancel debounces
        // this.recount.cancel();
        // this.bookmarkManager.emitSaveBookmarks.cancel();
    }

    /**
     * Runs everytime web component's listened attribute changes.
     * @param {string} name
     * @param {string | undefined} oldValue
     * @param {string | undefined} newValue
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "book-page" && oldValue) {
            const updatedPage = parseInt(newValue);
            this.jumpToPage(updatedPage);
        }
    }
}

window.customElements.define("book-web-component", BookWebComponent);
