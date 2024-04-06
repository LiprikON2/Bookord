export default class BookLoader {
    #shadowRoot;
    #parentComponent;

    constructor(bookComponent) {
        this.#parentComponent = bookComponent;
        this.#shadowRoot = bookComponent.shadowRoot;
    }

    /**
     * Collects book's styles and adds them to the book component
     * @param {any} styles
     * @param {Array<HtmlObject>} section
     * @returns {Promise<void>}
     */
    loadStyles(styles, section) {
        const styleElem = this.#shadowRoot.getElementById("book-style");

        const sectionStyles = this.#getSectionStyleReferences(section);
        const inlineStyles = this.#getSectionInlineStyles(section);

        styleElem.innerHTML = inlineStyles;

        // Appends all of the referenced
        // styles to the style element
        Object.keys(styles).forEach((index) => {
            const bookStyle = styles[index];
            if (sectionStyles.includes(bookStyle.href)) {
                styleElem.innerHTML += bookStyle._data;
            }
        });
    }

    /**
     * Loads book's content and appends a end-marker to it
     * @param {HtmlObject} section
     * @returns {Promise<void>}
     */
    async loadContent(section) {
        this.#parentComponent.contentElem.innerHTML = "";
        // Remove head tag from section
        section = section.slice(1);
        this.#recCreateElements(this.#parentComponent.contentElem, section);
    }

    /**
     * Returns all references to stylesheet names in a section
     * @param {HtmlObject} section
     * @returns {Array<string>}
     */
    #getSectionStyleReferences(section) {
        // First tag of a section is the head tag
        const headLinks = section[0].children.filter((elem) => {
            return elem.tag === "link";
        });

        const sectionStyles = headLinks.map((link) => link?.attrs?.href);
        return sectionStyles;
    }

    /**
     * Returns inline styles of a particular book section
     * @param {HtmlObject} section
     * @returns {string}
     */
    #getSectionInlineStyles(section) {
        const headStyles = section[0].children.filter((elem) => {
            return elem.tag === "style";
        });
        return headStyles[0]?.children?.[0]?.text ?? "";
    }

    /**
     * Recursively creates and appends child elements to the respective child's parent
     * @param {HTMLElement} parent
     * @param {HtmlObject} children
     * @returns {void}
     */
    #recCreateElements(parent, children) {
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
                    this.#recCreateElements(tag, element.children);
                }
                parent.appendChild(tag);
            } else {
                const textNode = document.createTextNode(element.text);
                parent.appendChild(textNode);
            }
        });
    }
}
