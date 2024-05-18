import type { BookContent } from "~/renderer/stores";

export default class StyleLoader {
    constructor(private styleElem: HTMLElement) {}

    /**
     * Collects book's styles and adds them to the book component
     */
    loadStyles(
        styles: BookContent["styles"],
        sectionContent: ArrayElement<BookContent["sections"]>["content"]
    ) {
        let stylesContent = "";
        const sectionStyles = this.getSectionStyleReferences(sectionContent);
        const inlineStyles = this.getSectionInlineStyles(sectionContent);

        stylesContent += inlineStyles;

        // Appends all of the referenced styles to the style element
        Object.values(styles).forEach((style) => {
            if (sectionStyles.includes(style.href)) {
                stylesContent += style._data;
            }
        });

        this.styleElem.innerHTML = stylesContent;
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
