import React from "react";
import { observer } from "mobx-react-lite";
import { Divider, Text, SimpleGrid } from "@mantine/core";

interface DatesGroupProps {
    getPublishDate: () => string;
    getAddedDate: () => string;
    getOpenedDate: () => string;
}
export const DatesGroup = observer(
    ({ getPublishDate, getAddedDate, getOpenedDate }: DatesGroupProps) => {
        return (
            <SimpleGrid cols={2} mt="md">
                <Text fz="sm">Publish date: {getPublishDate() ?? "Unknown"}</Text>
                <Text fz="sm">Added date: {getAddedDate() ?? "Unknown"}</Text>
                <Text fz="sm" />
                <Text fz="sm">Last opened date: {getOpenedDate() ?? "Never"}</Text>
            </SimpleGrid>
        );
    }
);
