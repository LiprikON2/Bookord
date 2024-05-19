import { useMemo } from "react";
import { action } from "mobx";

import { useBookReadStore, type Structure } from "~/renderer/stores";
import type { TocChildProps } from "../components";
import type { TocState } from "../../../scenes/BookWebComponent";

const checkIfHasSelectChild = (tocProp: TocChildProps): boolean => {
    if (tocProp.isSelected) return true;

    if (tocProp.tocProps?.length)
        return tocProp.tocProps.some((tocProp) => checkIfHasSelectChild(tocProp));
    return false;
};

const updateHasSelectedChild = (tocProp: TocChildProps): TocChildProps => {
    const hasSelectedChild = checkIfHasSelectChild(tocProp);
    const tocProps = tocProp.tocProps?.map(updateHasSelectedChild) ?? tocProp.tocProps;

    return {
        ...tocProp,
        hasSelectedChild,
        tocProps,
    };
};

const getTocPropExtractor = (
    sectionName: string,
    tocNavTo: (sectionId: Structure["sectionId"]) => void,
    recDepth = 0,
    parentIndex = 0,
    isSelectedFound = false
): ((tocChild: Structure, index: number) => TocChildProps) => {
    return (tocChild, index): TocChildProps => {
        let isSelected = false;
        if (!isSelectedFound) {
            isSelected = tocChild.sectionId === sectionName;
            isSelectedFound = isSelected;
        }

        const { children, ...toc } = tocChild;

        const tocPropsExtractor = getTocPropExtractor(
            sectionName,
            tocNavTo,
            recDepth + 1,
            index,
            isSelectedFound
        );
        const tocProps = children?.map(tocPropsExtractor) ?? null;
        return {
            key: `${parentIndex}-${recDepth}-${index}-${tocChild.sectionId}`,
            recDepth,
            isSelected,
            hasSelectedChild: false,
            onClick: () => {
                if (!children?.length) tocNavTo(tocChild.sectionId);
            },
            toc,
            tocProps,
        };
    };
};

const getTocPropSelectedUpdater = (
    sectionName: string,
    isSelectedFound = false
): ((tocProp: TocChildProps) => TocChildProps) => {
    return (tocProp) => {
        let isSelected = false;
        if (!isSelectedFound) {
            isSelected = tocProp.toc.sectionId === sectionName;
            isSelectedFound = isSelected;
        }

        const tocProps =
            tocProp.tocProps?.map(getTocPropSelectedUpdater(sectionName, isSelectedFound)) ??
            tocProp.tocProps;

        return {
            ...tocProp,
            isSelected,
            tocProps,
        };
    };
};

const getTocProps = (
    tocChildren: Structure[],
    tocState: TocState,
    tocNavTo: (sectionId: Structure["sectionId"]) => void
) => {
    let currentlyCheckedSection = tocState.currentSection;
    if (currentlyCheckedSection === null) return [];

    let tocProps = tocChildren
        .map(getTocPropExtractor(tocState.currentSectionName, tocNavTo))
        .map(updateHasSelectedChild);

    while (currentlyCheckedSection > 0 && !tocProps.some((tocProp) => tocProp.hasSelectedChild)) {
        currentlyCheckedSection--;
        const currentSectionName = tocState.sectionNames[currentlyCheckedSection];
        tocProps = tocProps
            .map(getTocPropSelectedUpdater(currentSectionName))
            .map(updateHasSelectedChild);
    }

    return tocProps;
};

// TODO fix Structure's `sectionId` (e.g. Warlock.epub structure has duplicate a1Title.xhtml, a1Credits.xhtml)
export const useTocNav = () => {
    const bookReadStore = useBookReadStore();

    const tocNavTo = action((sectionId: Structure["sectionId"]) => {
        if (!sectionId || !bookReadStore.isReady) return;
        bookReadStore.navToLink(sectionId);
    });

    const tocProps = useMemo(
        () => getTocProps(bookReadStore.toc, bookReadStore.tocState, tocNavTo),
        [bookReadStore.contentState.isInitSectionParsed, bookReadStore.tocState.currentSection]
    );

    return tocProps;
};
