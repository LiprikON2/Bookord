import React, { forwardRef } from "react";

import { Box, Group, Stack, Text } from "@mantine/core";

export const BookUi = forwardRef(
    (
        {
            title,
            uiState,
            visible = true,
            children,
        }: {
            title: string;
            uiState: UiState;
            visible?: boolean;
            children?: React.ReactNode;
        },
        ref
    ) => {
        return (
            <Stack h="100%" gap={4} ref={ref as any}>
                <Group justify="center" px={4}>
                    <Text c="dimmed" ta="center" fw={500}>
                        {title}
                    </Text>
                </Group>
                <Box style={{ overflow: "hidden", flexBasis: "100%" }}>{children}</Box>
                <Group justify="space-between" px={4}>
                    <Text c="dimmed" display="inline">
                        {uiState.currentSectionTitle}
                    </Text>
                    <Text c="dimmed" display="inline">
                        <span>{uiState.currentSectionPage + 1}</span>
                        <span>/</span>
                        <span>{uiState.totalSectionPages}</span>
                    </Text>
                </Group>
            </Stack>
        );
    }
);
