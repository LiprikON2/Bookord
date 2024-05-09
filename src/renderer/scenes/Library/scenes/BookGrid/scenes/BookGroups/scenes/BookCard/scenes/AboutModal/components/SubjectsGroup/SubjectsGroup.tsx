import React from "react";
import { observer } from "mobx-react-lite";
import { Divider, Group, Text, Badge } from "@mantine/core";

import classes from "./SubjectsGroup.module.css";

interface TagsGroup {
    getName: () => string;
    getTagNames: () => string[];
    onTagClick: (tagName: string) => void;
}

export const TagsGroup = observer(({ getName, getTagNames, onTagClick }: TagsGroup) => {
    const categoryName = getName();
    const tagNames = getTagNames();

    return (
        <Group mt="md">
            {!tagNames.length && <Text fz="sm">No {categoryName.toLocaleLowerCase()} listed</Text>}
            {tagNames.map((tagName) => (
                <Badge
                    tabIndex={0}
                    key={tagName}
                    size="sm"
                    className={classes.badge}
                    onClick={() => onTagClick(tagName)}
                >
                    {tagName}
                </Badge>
            ))}
        </Group>
    );
});
