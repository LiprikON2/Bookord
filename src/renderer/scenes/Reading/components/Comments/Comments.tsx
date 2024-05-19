import React from "react";
import { observer } from "mobx-react-lite";
import { Text, Button, Drawer, ScrollArea, SegmentedControl } from "@mantine/core";
import { useDisclosure, useDocumentTitle, useToggle } from "@mantine/hooks";
import { IconMessages } from "@tabler/icons-react";

import { Giscus } from "~/renderer/components";
import { useBookReadStore } from "~/renderer/stores";
import classes from "./Comments.module.css";

interface CommentsProps {
    //
}

const modes = ["Book", "Chapter"];

export const Comments = observer(({}: CommentsProps) => {
    const [opened, { open, close }] = useDisclosure(false);
    const bookReadStore = useBookReadStore();
    const [mode, toggleMode] = useToggle(modes);

    const bookTitle = bookReadStore.metadata.title;
    const chapterNum = bookReadStore.autobookmark.elementSection;

    const getGiscusTitle = () => {
        if (mode === "Book") return bookTitle;
        if (mode === "Chapter") return `${bookTitle} (section ${chapterNum})`;
    };
    const giscusTitle = getGiscusTitle();
    useDocumentTitle(giscusTitle);

    return (
        <>
            <Drawer
                opened={opened}
                onClose={close}
                title={
                    <Text span size="lg" fw={700}>
                        Discussion for {giscusTitle}
                    </Text>
                }
                keepMounted
                scrollAreaComponent={ScrollArea.Autosize}
                position="right"
                withCloseButton={false}
            >
                {/* TODO fix floating indicator, move to the right of title*/}
                <SegmentedControl onChange={toggleMode} data={modes} />
                <Giscus key={giscusTitle} />
            </Drawer>

            {bookReadStore.isReady && (
                <Button
                    variant="default"
                    mt="auto"
                    value="settings"
                    fw="normal"
                    leftSection={<IconMessages className={classes.icon} strokeWidth={1.5} />}
                    styles={{
                        inner: {
                            justifyContent: "flex-start",
                        },
                        root: {
                            flexGrow: 1,
                        },
                    }}
                    onClick={open}
                >
                    Comments
                </Button>
            )}
        </>
    );
});
