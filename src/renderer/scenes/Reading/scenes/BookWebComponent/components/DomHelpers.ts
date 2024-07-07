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

export const getTextNode = (element: Element | HTMLElement, nodeValue: string = null) => {
    if (element instanceof Text) return element;

    for (const childNode of element.childNodes) {
        if (childNode.nodeType === Node.TEXT_NODE) {
            if (nodeValue === null || childNode.nodeValue === nodeValue) return childNode;
        }
    }
};

export interface SerializedRange {
    isStartAText: boolean;
    startNodeValue: string | null;
    isEndAText: boolean;
    endNodeValue: string | null;
    startSelector: string;
    endSelector: string;
    endOffset: number;
    startOffset: number;
}

export const serializeRange = (
    range: Range,
    dom: Document | ShadowRoot | HTMLElement
): SerializedRange => {
    const [nonTextStart, isStartAText] = getFirstNonTextElement(range.startContainer);
    const [nonTextEnd, isEndAText] = getFirstNonTextElement(range.endContainer);

    const startNodeValue = isStartAText ? range.startContainer.nodeValue : null;
    const endNodeValue = isEndAText ? range.endContainer.nodeValue : null;

    const startSelector = new QuerySerializer(dom, nonTextStart).needle;
    const endSelector = new QuerySerializer(dom, nonTextEnd).needle;

    const { endOffset, startOffset } = range;

    return {
        isStartAText,
        startNodeValue,
        isEndAText,
        endNodeValue,

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
        isStartAText,
        isEndAText,

        startNodeValue,
        startSelector,
        endSelector,
        endNodeValue,

        endOffset,
        startOffset,
    } = serializedRange;

    const start = dom.querySelector(startSelector);
    const startContainer = isStartAText ? getTextNode(start, startNodeValue) : start;

    const end = dom.querySelector(endSelector);
    const endContainer = isEndAText ? getTextNode(end, endNodeValue) : end;

    const range = document.createRange();

    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);

    return range;
};

export const doesRangeContainsClass = (
    dom: Document | ShadowRoot | HTMLElement,
    range: Range,
    className: string
) => {
    return [...dom.querySelectorAll("." + className.replaceAll(" ", "."))].some((node) =>
        range.intersectsNode(node)
    );
};

export const appendUniqueClass = (className: string) => {
    const firstClassName = className.split(" ")[0];
    const uuid = Math.random().toString(36).slice(2, 11);

    return `${className} ${firstClassName}-${uuid}`;
};
