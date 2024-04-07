import { useContext } from "react";
import { BookComponentContext } from "~/renderer/contexts";
import { Structure } from "~/renderer/stores";

export const useTocNav = () => {
    const { contextRef, contextUiState } = useContext(BookComponentContext);

    const handleTocNav = (sectionId: Structure["sectionId"]) => {
        if (!sectionId && contextRef) return;

        contextRef.navToLink(sectionId);
    };

    return { handleTocNav, currentSectionTitle: contextUiState?.currentSectionTitle };
};
