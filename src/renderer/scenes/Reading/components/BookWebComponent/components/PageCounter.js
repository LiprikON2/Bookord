import BookWebComponent from "../BookWebComponent";

export default class PageCounter {
    #parentComponent;
    #shadowRoot;
    #isCounting;

    constructor(bookComponent) {
        this.#parentComponent = bookComponent;
        this.#shadowRoot = bookComponent.shadowRoot;
        this.#isCounting = false;
    }
    get isCounting() {
        return this.#isCounting;
    }
    start() {
        if (!this.isCounting) {
            this.#createCounterComponent();
        }
    }

    /**
     * Creates another web component which is used to count pages of a book, and then destroys it
     * @return {Promise<any>}
     */
    async #createCounterComponent() {
        this.#isCounting = true;

        /** Create a counter`component inside the current component
         * @type {BookWebComponent}
         */
        // @ts-ignore
        const childComponent = document.createElement("book-web-component");
        this.#shadowRoot.appendChild(childComponent);

        // Make childComponent hidden
        const rootElem = childComponent.rootElem;
        rootElem.style.visibility = "hidden";
        rootElem.style.position = "absolute";

        await this.#countBookPages(childComponent);

        this.#isCounting = false;
        childComponent.remove();
    }

    /**
     * Asynchronously and non-blockingly counts pages of a book with a help of a parent web component
     * @param {BookWebComponent} childComponent - instance of a parent web component which created this counter web component
     * @returns {Promise<void>}
     */
    async #countBookPages(childComponent) {
        const book = await this.#parentComponent.book;

        this.#parentComponent.stateManager.sectionPagesArr = [];

        // TODO start counting pages near where user left off (0th bookmark)
        await this.#asyncForEach(book.sectionNames, async (sectionName, sectionIndex) => {
            const section = childComponent.getSection(sectionIndex);
            await childComponent.styleLoader.loadStyles(section);
            await childComponent.styleLoader.loadContent(section);

            const totalSectionPages = childComponent.countSectionPages();

            this.#parentComponent.stateManager.sectionPagesArr.push(totalSectionPages);
            // Update page count every 10 sections
            if (sectionIndex % 10 === 0) {
                this.#parentComponent.updateBookUi();
            }
            await this.#waitForNextTask();
        });

        this.#parentComponent.updateBookUi();
    }

    /**
     * Asynchronous version of a forEach
     * @param {Array} array
     * @param {*} callback
     * @returns {Promise<void>}
     */
    async #asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    /**
     * Splits code in chunks
     * https://stackoverflow.com/a/67135932/10744339
     * @returns {Promise<void>}
     */
    #waitForNextTask() {
        // @ts-ignore
        const { port1, port2 } = (this.#waitForNextTask.channel ??= new MessageChannel());

        return new Promise((resolve) => {
            port1.addEventListener("message", () => resolve(), { once: true });
            port1.start();
            port2.postMessage("");
        });
    }
}
