import React from "react";
import { Box, Text, ScrollArea } from "@mantine/core";

import classes from "./PanelContent.module.css";

interface PanelContentProps {
    heading?: string;
    children?: React.ReactNode;
}

export const PanelContent = ({ heading, children }: PanelContentProps) => {
    return (
        <Box py="sm" mih={0}>
            {heading && (
                <Text c="dimmed" size="sm" px="sm" mb="xs">
                    {heading}
                </Text>
            )}

            <ScrollArea
                h="100%"
                w="100%"
                scrollbars="y"
                scrollbarSize={6}
                type="hover"
                classNames={{
                    scrollbar: classes.scrollbar,
                    viewport: classes.viewport,
                }}
                styles={{
                    viewport: {
                        paddingInline: "md",
                        paddingLeft: 0,
                    },
                }}
            >
                {children}
            </ScrollArea>
        </Box>
    );
};
