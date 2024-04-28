import React, { useCallback, useEffect } from "react";
import { Box, Text, ScrollArea } from "@mantine/core";

import classes from "./PanelContent.module.css";
import { useMergedRef, useScrollIntoView } from "@mantine/hooks";
import { useAutoscrollIntoView } from "./hooks";

interface PanelContentProps {
    heading?: string;
    children?: (autoscrollTargetRef: (node: any) => void) => React.ReactNode;
}

export const PanelContent = ({ heading, children }: PanelContentProps) => {
    const { scrollableRef, autoscrollTargetRef } = useAutoscrollIntoView({
        offset: 42,
        duration: 300,
    });

    return (
        <Box mt="sm" mih={0} className={classes.box}>
            {heading && (
                <Text c="dimmed" size="sm" px="sm" mb="xs">
                    {heading}
                </Text>
            )}

            <ScrollArea
                viewportRef={scrollableRef}
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
                {children(autoscrollTargetRef)}
            </ScrollArea>
        </Box>
    );
};
