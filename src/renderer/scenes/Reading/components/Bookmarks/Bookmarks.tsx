import React from "react";
import { NavLink, Stack, Text, rem } from "@mantine/core";
import { IconBookmark } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { type Structure, useBookReadStore } from "~/renderer/stores";
import classes from "./Bookmarks.module.css";
import { action } from "mobx";

interface BookmarksProps {
    autoscrollTargetRef: (node: any) => void;
}

export const Bookmarks = observer(({ autoscrollTargetRef }: BookmarksProps) => {
    const bookReadStore = useBookReadStore();

    const navTo = action((sectionId: Structure["sectionId"], elementIndex: number) => {
        if (!sectionId || !bookReadStore.isReady) return;
        bookReadStore.bookComponent.navToLink(sectionId, { elementIndex });
    });

    if (!bookReadStore.bookmarks.length)
        return (
            <Text c="dimmed" size="sm" px="sm">
                No bookmarks saved yet.
            </Text>
        );
    return bookReadStore.bookmarks.map(
        ({ active, sectionId, label, elementIndex, elementSection }) => (
            <NavLink
                key={`${elementSection}-${elementIndex}`}
                my={2}
                leftSection={
                    <Stack gap={2} align="center" miw={24}>
                        <IconBookmark className={classes.icon} stroke={1.5} />
                        <Text c="dimmed" size={rem(11)}>
                            {elementSection}-{elementIndex}
                        </Text>
                    </Stack>
                }
                className={classes.navLink}
                classNames={{ label: classes.label }}
                label={label}
                active={active}
                ref={active ? autoscrollTargetRef : null}
                onClick={() => navTo(sectionId, elementIndex)}
            />
        )
    );
});
