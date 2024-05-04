import React, { forwardRef } from "react";

import { Box, Group, Stack, Text } from "@mantine/core";
import { observer } from "mobx-react-lite";

interface BookUiProps {
    title: string;
    uiState: UiState;
    visible?: boolean;
    children?: React.ReactNode;
}

const BookUi = observer(
    // eslint-disable-next-line react/display-name
    forwardRef(
        (
            { title, uiState, visible = true, children }: BookUiProps,
            ref: React.ForwardedRef<HTMLDivElement>
        ) => {
            return (
                <Stack h="100%" gap={4} ref={ref}>
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
    )
);

BookUi.displayName = "BookUi";
export { BookUi };
