import debounce from "lodash/debounce";

export default class BookmarkManager {
    #parentComponent;
    #bookmarkList = [{ sectionIndex: 0, elementIndex: 0 }];

    constructor(bookComponent) {
        this.#parentComponent = bookComponent;
    }

    /**
     * Sets the entire bookmarkList if provided bookmarkList is not empty.
     * @param {BookmarkList} bookmarkList
     * @returns {void}
     */
    setBookmarkList(bookmarkList) {
        if (bookmarkList.length) {
            const hasCorrectKeys = bookmarkList.every((bookmark) =>
                this.#isValidBookmark(bookmark)
            );

            if (hasCorrectKeys) {
                this.#bookmarkList = bookmarkList;
            }
        }
    }

    /**
     * Adds bookmark to the bookmarkList
     * @param {Bookmark} bookmark
     * @returns {void}
     */
    addBookmark(bookmark) {
        if (this.#isValidBookmark(bookmark)) {
            this.#bookmarkList.push(bookmark);
        }
    }

    /**
     * Returns autobookmark
     * @returns {[number, number]} - sectionIndex and elementIndex of a bookmark
     */
    getAutoBookmark() {
        const { sectionIndex, elementIndex } = this.#bookmarkList[0];
        return [sectionIndex, elementIndex];
    }

    /**
     * Sets autoBookmark to the specified bookmark
     * @param {Bookmark} bookmark
     * @returns {void}
     */
    setAutoBookmark(bookmark) {
        if (this.#isValidBookmark(bookmark)) {
            this.#bookmarkList[0] = bookmark;
        }
    }

    /**
     * Updates autoBookmark to the current position inside the book
     * @returns {void}
     */
    updateAutoBookmark() {
        const element = this.#parentComponent.getVisibleElement();
        if (!element) return;

        const elementIndex = this.#getElementIndex(element);
        const sectionIndex = this.#parentComponent.stateManager.book.currentSection;

        this.setAutoBookmark({ sectionIndex, elementIndex });
    }

    /**
     * Emits "saveBookmarksEvent" to save bookmarks externally
     * @param {Event} e - Event
     * @listens Event
     * @return {void}
     */
    emitSaveBookmarks = debounce((e) => {
        let book;
        if (this.#parentComponent.status !== "sectionReady") {
            book = this.#parentComponent.book;
        } else {
            book = this.#parentComponent.initBook;
        }

        book.then(({ name: bookName }) => {
            this.updateAutoBookmark();
            const saveBookmarksEvent = new CustomEvent("saveBookmarksEvent", {
                bubbles: true,
                cancelable: false,
                composed: true,
                detail: {
                    bookName,
                    bookmarkList: this.#bookmarkList,
                },
            });

            this.#parentComponent.dispatchEvent(saveBookmarksEvent); // todo uncomment
        });
    }, 500);

    /**
     * Returns true if bookmark object has "sectionIndex" and "elementIndex" keys, throws error otherwise
     * @param {Bookmark} bookmark
     * @returns {boolean}
     */
    #isValidBookmark(bookmark) {
        const hasKeys = "sectionIndex" in bookmark && "elementIndex" in bookmark;
        if (!hasKeys) {
            throw new Error("The format of a bookmark is wrong.");
        }
        return hasKeys;
    }

    /**
     * Returns selector of an element based on nth-child with respect to the content element
     * @param {HTMLElement} element
     * @returns {number}
     */
    #getElementIndex(element) {
        const allElems = this.#parentComponent.contentElem.querySelectorAll("*");
        let nthElement;
        [...allElems].some((elem, index) => {
            const isFound = elem === element;
            if (isFound) {
                nthElement = index;
            }
            return isFound;
        });
        return nthElement;
    }
}
