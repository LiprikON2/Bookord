import React from "react";
import { Box, NavLink, Text } from "@mantine/core";

import { useBookContent, type BookKey } from "~/renderer/stores";

type Structure = {
    name: string;
    path: string;
    playOrder: string;
    sectionId: string;
    nodeId?: string;
    children: Structure[];
};

interface TocProps {
    bookKey: BookKey;
}

const TocChild = ({ recDepth = 0, toc }: { recDepth?: number; toc?: Structure }) => {
    return (
        <NavLink label={toc.name} childrenOffset={16} defaultOpened={recDepth === 0}>
            {toc?.children?.length &&
                toc.children.map((tocChild) => (
                    <TocChild recDepth={recDepth + 1} key={tocChild.sectionId} toc={tocChild} />
                ))}
        </NavLink>
    );
};

export const Toc = ({ bookKey }: TocProps) => {
    const { content } = useBookContent(bookKey);

    const tocChildren = content?.structure as Structure[];

    return (
        <>
            <Text c="dimmed" size="sm" px="sm" mb="xs">
                Table of contents
            </Text>
            {tocChildren.map((tocChild) => (
                <TocChild key={tocChild.sectionId} toc={tocChild} />
            ))}
        </>
    );
};
