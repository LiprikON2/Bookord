import React from "react";
import { NavLink, Stack, Skeleton, Text, rem, CloseButton } from "@mantine/core";
import { IconBookmark } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import { action } from "mobx";

import { SkeletonSidebar } from "~/renderer/components";
import { type Structure, useBookReadStore, Bookmark } from "~/renderer/stores";
import classes from "./Bookmarks.module.css";

interface BookmarksProps {
    autoscrollTargetRef: (node: any) => void;
}

export const Bookmarks = observer(({ autoscrollTargetRef }: BookmarksProps) => {
    const bookReadStore = useBookReadStore();

    const navTo = action(
        (sectionId: Structure["sectionId"], elementIndex: number, elementSelector: string) => {
            if (!sectionId || !bookReadStore.isReady) return;
            bookReadStore.bookComponent.navToLink(sectionId, { elementIndex, elementSelector });
        }
    );

    if (!bookReadStore.isReady) {
        return <SkeletonSidebar />;
    }

    if (bookReadStore.isReady && !bookReadStore.bookmarks.length) {
        return (
            <Text c="dimmed" size="sm" px="sm">
                No bookmarks saved yet.
            </Text>
        );
    }
    const removeBookmark = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        bookmark: Bookmark
    ) => {
        e.stopPropagation();
        bookReadStore.removeManualBookmark(bookmark);
    };

    return bookReadStore.bookmarks.map(({ bookmark, active, label, sectionId }) => (
        <NavLink
            key={`${bookmark.elementSection}-${bookmark.elementIndex}`}
            my={2}
            leftSection={
                <Stack gap={2} align="center" miw={24}>
                    <IconBookmark className={classes.icon} stroke={1.5} />
                    <Text c="dimmed" size={rem(11)}>
                        {bookmark.elementSection}.{bookmark.elementIndex}
                    </Text>
                </Stack>
            }
            className={classes.navLink}
            classNames={{ label: classes.label, section: classes.section }}
            label={label}
            active={active}
            ref={active ? autoscrollTargetRef : null}
            onClick={() => navTo(sectionId, bookmark.elementIndex, bookmark.elementSelector)}
            rightSection={<CloseButton size="sm" onClick={(e) => removeBookmark(e, bookmark)} />}
        />
    ));
});
