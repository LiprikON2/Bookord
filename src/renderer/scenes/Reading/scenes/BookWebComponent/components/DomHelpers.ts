import QuerySerializer from "./QuerySerializer";

export const getDirectDescendant = (
    ancestor: HTMLElement,
    descendant: HTMLElement
): HTMLElement => {
    const isDirectDescendant = descendant.parentNode === ancestor;
    if (isDirectDescendant) return descendant;

    return getDirectDescendant(ancestor, descendant.parentNode as HTMLElement);
};

export const getFirstNonTextElement = (
    element: Text | HTMLElement | Node
): [HTMLElement, boolean] => {
    let wasText = false;
    if (element instanceof Text) {
        wasText = true;
        return [element.parentNode as HTMLElement, wasText];
    }
    return [element as HTMLElement, wasText];
};

export const getTextElement = (element: Element | HTMLElement) => {
    if (element instanceof Text) return element;

    for (const childNode of element.childNodes) {
        if (childNode.nodeType === Node.TEXT_NODE) {
            const textNode = childNode;
            return textNode;
        }
    }
};

interface SerializedRange {
    isCommonAncestorAText: boolean;
    isStartAText: boolean;
    isEndAText: boolean;
    commonAncestorSelector: string;
    startSelector: string;
    endSelector: string;
    endOffset: number;
    startOffset: number;
}

export const serializeRange = (range: Range, dom: Document | ShadowRoot | HTMLElement) => {
    const [nonTextCommonAncestor, isCommonAncestorAText] = getFirstNonTextElement(
        range.commonAncestorContainer
    );
    const [nonTextStart, isStartAText] = getFirstNonTextElement(range.startContainer);
    const [nonTextEnd, isEndAText] = getFirstNonTextElement(range.endContainer);

    const commonAncestorSelector = new QuerySerializer(dom, nonTextCommonAncestor).needle;
    const startSelector = new QuerySerializer(dom, nonTextStart).needle;
    const endSelector = new QuerySerializer(dom, nonTextEnd).needle;

    const { endOffset, startOffset } = range;

    return {
        isCommonAncestorAText,
        isStartAText,
        isEndAText,

        commonAncestorSelector,
        startSelector,
        endSelector,

        endOffset,
        startOffset,
    };
};

export const deserializeRange = (
    serializedRange: SerializedRange,
    dom: Document | ShadowRoot | HTMLElement
) => {
    const {
        isCommonAncestorAText,
        isStartAText,
        isEndAText,

        commonAncestorSelector,
        startSelector,
        endSelector,

        endOffset,
        startOffset,
    } = serializedRange;

    const commonAncestor = dom.querySelector(commonAncestorSelector);
    const commonAncestorContainer = isCommonAncestorAText
        ? getTextElement(commonAncestor)
        : commonAncestor;

    const start = dom.querySelector(startSelector);
    const startContainer = isStartAText ? getTextElement(start) : start;

    const end = dom.querySelector(endSelector);
    const endContainer = isEndAText ? getTextElement(end) : end;

    const range = document.createRange();

    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);

    console.log("start", start, "end", end, "commonAncestor", commonAncestor);

    console.log("startOffset", startOffset, "endOffset", endOffset);

    return range;
};
