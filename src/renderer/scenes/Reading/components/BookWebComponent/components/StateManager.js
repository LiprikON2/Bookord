class BookState {
    #parentComponent;

    title = "";
    sectionCount = 0;
    currentSection;

    get currentPage() {
        return 0;
    }
    get totalPages() {
        return 0;
    }

    constructor(bookComponent) {
        this.#parentComponent = bookComponent;
    }
}
class SectionState {
    #parentComponent;

    title = "";

    get currentPage() {
        const displayWidth = this.#parentComponent.displayWidth;
        const currentOffset = this.#parentComponent.currentOffset;

        const unroundedCurrentPage = currentOffset / displayWidth;
        const roundedCurrentPage = Math.round(unroundedCurrentPage);

        return roundedCurrentPage;
    }
    get totalPages() {
        const totalWidth = this.#parentComponent.totalDisplayWidth;
        const displayWidth = this.#parentComponent.displayWidth;

        const unroundedSectionPages = totalWidth / displayWidth;
        const roundedSectionPages = Math.round(unroundedSectionPages);

        return roundedSectionPages;
    }
    get firstPage() {
        return 0;
    }
    get lastPage() {
        return this.totalPages - 1;
    }

    constructor(bookComponent) {
        this.#parentComponent = bookComponent;
    }
}

export default class StateManager {
    #parentComponent;

    totalSections = 0;

    sectionPagesArr = [0];

    constructor(bookComponent) {
        this.#parentComponent = bookComponent;

        this.book = new BookState(this.#parentComponent);
        this.section = new SectionState(this.#parentComponent);
    }

    setInitBookInfo(totalSections) {
        this.totalSections = totalSections;
    }

    getSectionBookPageBelongsTo(page) {
        const sliceOfPages = [];
        for (const [index, pageCount] of this.sectionPagesArr.entries()) {
            sliceOfPages.push(pageCount);
            const sumOfPages = sliceOfPages.reduce((prevValue, currValue) => prevValue + currValue);
            if (page <= sumOfPages) return index;
        }
        throw new Error("Couldn't get section book page belonged to.");
    }

    getTotalSectionPages(sectionIndex) {
        return this.sectionPagesArr[sectionIndex];
    }

    isSectionCounted(section) {
        return !!this.sectionPagesArr[section];
    }
    getCurrentBookPage() {
        const sumOfPages = this._sumFirstNArrayItems(
            this.sectionPagesArr,
            this.book.currentSection
        );
        // todo
        const totalSectionPages = this.getTotalSectionPages(this.book.currentSection);
        const totalSectionPages2 = this.#parentComponent.countSectionPages();
        const currentSectionPage = this.getCurrentSectionPage();

        return sumOfPages - totalSectionPages2 + currentSectionPage;
    }
    getTotalBookPages() {
        const totalBookPages = this.sectionPagesArr.reduce(
            (prevValue, currValue) => prevValue + currValue
        );
        return totalBookPages;
    }

    _sumFirstNArrayItems(array, n) {
        const arraySlice = array.slice(0, n + 1);
        const arraySum = arraySlice.reduce((prevValue, currValue) => prevValue + currValue);
        return arraySum;
    }

    /**
     * Updates book's state
     * @param {any} book
     * @param {number} currentSection
     * @returns {void}
     */
    updateState(book, currentSection) {
        this.book.currentSection = currentSection;

        const currentSectionTitle = this.#recGetSectionTitle(book, book.structure, currentSection);
        this.section.title = currentSectionTitle;
    }

    /**
     * Recursively extracts section (chapter) title from book's TOC
     * @param {Book} book
     * @param {Book['structure']} toc - Table of Contents
     * @param {number} sectionIndex - Section index
     * @param {boolean} [root] - A way to differentiate between recursive and non-recursive function call
     * @returns {string}
     */
    #recGetSectionTitle(book, toc, sectionIndex, root = true) {
        let descendantSectionTitle;
        for (const tocEntry of toc) {
            const tocEntryChildren = tocEntry?.children;
            if (tocEntryChildren) {
                descendantSectionTitle = this.#recGetSectionTitle(
                    book,
                    tocEntryChildren,
                    sectionIndex,
                    false
                );
                if (descendantSectionTitle) break;
            }
        }
        const tocEntry = toc.find(
            (tocEntry) => tocEntry.sectionId === book.sectionNames[sectionIndex]
        );
        const sectionTitle = tocEntry?.name;

        if (descendantSectionTitle) {
            // Use the deep-nested title if possible
            return descendantSectionTitle;
        } else if (sectionTitle) {
            return sectionTitle;
        } else if (root && sectionIndex >= 0 && sectionIndex < this.totalSections) {
            // Untitled sections try to use previous section's title
            const prevSectionTitle = this.#recGetSectionTitle(book, toc, sectionIndex - 1);
            return prevSectionTitle;
        } else {
            return "";
        }
    }
}
