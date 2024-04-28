import { useCallback, useContext, useEffect, useState } from "react";
import { useMergedRef } from "@mantine/hooks";

import { BookComponentContext } from "~/renderer/contexts";
import { Structure } from "~/renderer/stores";

export const useTocNav = () => {
    const { contextRef, contextUiState } = useContext(BookComponentContext);

    const tocNavTo = (sectionId: Structure["sectionId"]) => {
        if (!sectionId && contextRef) return;

        contextRef.navToLink(sectionId);
    };

    return { tocNavTo, currentSectionTitle: contextUiState?.currentSectionTitle };
};
