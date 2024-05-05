import { useContext, useMemo } from "react";

import { isDev } from "~/common/helpers";
import { BookComponentContext, BookComponentTocContext } from "~/renderer/contexts";
import type { Structure } from "~/renderer/stores";
import { TocChildProps } from "../components";
import { TocState } from "../../BookWebComponent";

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
export const useTocNav = (tocChildren: Structure[]) => {
    // TODO split ref and uiState contexts
    const { contextRef } = useContext(BookComponentContext);
    const { tocState } = useContext(BookComponentTocContext);

    const tocNavTo = (sectionId: Structure["sectionId"]) => {
        if (!sectionId || !contextRef) return;

        contextRef.navToLink(sectionId);
    };

    const tocProps = useMemo(
        () => getTocProps(tocChildren, tocState, tocNavTo),
        [tocChildren, tocState.currentSection]
    );

    // if (isDev()) {
    //     // @ts-ignore
    //     window["tocProps"] = tocProps;
    //     // @ts-ignore
    //     window["tocState"] = tocState;
    // }

    return { tocNavTo, tocProps };
};
