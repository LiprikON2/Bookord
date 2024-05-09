import React from "react";
import { observer } from "mobx-react-lite";
import { Badge, Group, Progress, Text } from "@mantine/core";

import classes from "./ProgressGroup.module.css";

interface ProgressGroupProps {
    getProgress: () => number;
    getProgressStr: () => string;
    getReadTimeStr: () => string;
    getOpenedTimeAgoStr: () => string;
}

export const ProgressGroup = observer(
    ({ getProgress, getProgressStr, getReadTimeStr, getOpenedTimeAgoStr }: ProgressGroupProps) => {
        const progress = getProgress();

        const progressStr = getProgressStr();
        const readTimeStr = getReadTimeStr();
        const openedTimeAgoStr = getOpenedTimeAgoStr();

        return (
            <>
                <Group justify="space-between" mt="xs">
                    <Text fz="sm" c="dimmed">
                        Reading progress
                    </Text>
                    <Text fz="sm" c="dimmed">
                        {progressStr}
                    </Text>
                </Group>

                <Progress value={progress * 100} mt={5} />
                <Group justify="space-between" mt="md">
                    <Text fz="sm">
                        {openedTimeAgoStr === "never" ? (
                            "Never opened"
                        ) : (
                            <>
                                Last opened{" "}
                                <Text span inherit fw={600}>
                                    {openedTimeAgoStr}
                                </Text>
                            </>
                        )}
                    </Text>
                    <Badge size="md">{readTimeStr}</Badge>
                </Group>
            </>
        );
    }
);
