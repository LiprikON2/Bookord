import { action } from "mobx";
import { useBookReadStore } from "~/renderer/stores";

const getParentElement = (ancestorElem: HTMLElement, childElem: ParentNode) => {
    let parentElem = childElem;

    while (parentElem.parentNode !== ancestorElem) {
        parentElem = parentElem.parentNode;
    }

    return parentElem;
};

const selectElem = (elem: Element, selection: Selection) => {
    const range = document.createRange();
    range.selectNodeContents(elem);

    selection.removeAllRanges();
    selection.addRange(range);
};

export const useTtsUtils = () => {
    const bookReadStore = useBookReadStore();

    const flipToElement = action((nextElem: Element) => {
        bookReadStore.bookComponent?.shiftToElement?.({ element: nextElem as HTMLElement });
    });

    const initTts = action((startElement: ParentNode, startElementSelectedText: string) => {
        const startParentElem = getParentElement(
            bookReadStore.bookComponent.contentElem,
            startElement
        ) as HTMLElement;
        const startElementText = startParentElem.textContent;

        /** Transforms selected text
         *       <p>Test 123 456</p>
         * from          |||
         *   to          |||||||
         */
        const initText = [
            startElementSelectedText,
            ...startElementText.split(startElementSelectedText).slice(1),
        ].join("");
        const nextParentElem = startParentElem.nextElementSibling;
        // @ts-ignore
        const selection: Selection = bookReadStore.bookComponent.shadowRoot.getSelection();
        selection.modify("extend", "forward", "paragraphboundary");

        return { initText, nextParentElem, selection };
    });

    const continuteTtsNextSection = action(
        (onSuccess: (nextSectionElem: Element, nextSelection: Selection) => void) => {
            bookReadStore.sectionForward();

            const elem = bookReadStore.bookComponent?.contentChildren[0];
            // @ts-ignore
            const selection: Selection = bookReadStore.bookComponent.shadowRoot.getSelection();
            selectElem(elem, selection);

            onSuccess?.(elem, selection);
        }
    );

    return { flipToElement, getParentElement, selectElem, initTts, continuteTtsNextSection };
};
