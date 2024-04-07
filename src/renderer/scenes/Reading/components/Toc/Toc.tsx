import React from "react";
import { Text } from "@mantine/core";

import { useBookContent, type BookKey } from "~/renderer/stores";
import { useTocNav } from "./hooks";
import { TocChild } from "./components";

interface TocProps {
    bookKey: BookKey;
}

export const Toc = ({ bookKey }: TocProps) => {
    const { content } = useBookContent(bookKey);
    const tocChildren = content?.structure;

    const { handleTocNav } = useTocNav();

    return (
        <>
            <Text c="dimmed" size="sm" px="sm" mb="xs">
                Table of contents
            </Text>
            {tocChildren.map((tocChild, index) => (
                <TocChild
                    isFirst={index === 0}
                    key={`${tocChild.sectionId}-${index}`}
                    toc={tocChild}
                    onClick={() => {
                        if (!tocChild?.children?.length) handleTocNav(tocChild.sectionId);
                    }}
                />
            ))}
        </>
    );
};
