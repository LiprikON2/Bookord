import React from "react";
import { observer } from "mobx-react-lite";
import { Divider, Group, Text, TypographyStylesProvider } from "@mantine/core";
import DOMPurify from "dompurify";

import { BookMetadata } from "~/renderer/stores";

interface DescriptionGroupProps {
    metadata: BookMetadata;
}
export const DescriptionGroup = observer(({ metadata }: DescriptionGroupProps) => {
    return (
        <Group mt="md">
            {!metadata.description && <Text fz="sm">No description provided</Text>}
            <TypographyStylesProvider>
                <div
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(metadata.description) }}
                />
            </TypographyStylesProvider>
        </Group>
    );
});
