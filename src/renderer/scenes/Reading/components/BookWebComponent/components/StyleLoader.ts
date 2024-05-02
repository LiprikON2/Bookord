import { BookContent } from "~/renderer/stores";
import BookWebComponent from "../BookWebComponent";

export default class StyleLoader {
    private shadowRoot;

    constructor(private bookComponent: BookWebComponent) {
        this.shadowRoot = this.bookComponent.shadowRoot;
    }

    /**
     * Collects book's styles and adds them to the book component
     */
    loadStyles(
        styles: BookContent["styles"],
        sectionContent: ArrayElement<BookContent["sections"]>["content"]
    ) {
        const styleElem = this.shadowRoot.getElementById("book-style");

        const sectionStyles = this.getSectionStyleReferences(sectionContent);
        const inlineStyles = this.getSectionInlineStyles(sectionContent);

        styleElem.innerHTML = inlineStyles;

        // Appends all of the referenced styles to the style element
        Object.values(styles).forEach((style) => {
            if (sectionStyles.includes(style.href)) {
                styleElem.innerHTML += style._data;
            }
        });
    }

    /**
     * Returns all references to stylesheet names in a section
     */
    private getSectionStyleReferences(
        sectionContent: ArrayElement<BookContent["sections"]>["content"]
    ) {
        // First tag of a section is the head tag
        const headLinks = sectionContent[0].children.filter((elem) => {
            return elem.tag === "link";
        });

        const sectionStyles = headLinks.map((link) => link?.attrs?.href);
        return sectionStyles;
    }

    /**
     * Returns inline styles of a particular book section
     */
    private getSectionInlineStyles(
        sectionContent: ArrayElement<BookContent["sections"]>["content"]
    ) {
        const headStyles = sectionContent[0].children.filter((elem) => {
            return elem.tag === "style";
        });
        const inlineStyles = headStyles[0]?.children?.[0]?.text ?? "";

        return inlineStyles;
    }
}
