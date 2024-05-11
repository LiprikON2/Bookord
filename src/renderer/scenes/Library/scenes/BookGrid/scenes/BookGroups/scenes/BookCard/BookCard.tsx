import React from "react";
import { IconInfoCircle, IconRobot, IconTrash } from "@tabler/icons-react";
import { Paper, Group, Indicator } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";

import context from "~/renderer/ipc/fileOperations";
import { BookKey, useBookReadStore, useBookStore } from "~/renderer/stores";
import { bookKeyRoute } from "~/renderer/appRenderer";
import { TitleObserver, TextObserver } from "~/renderer/components";
import { AboutModal, BookMenu, SummaryModal } from "./scenes";
import { ProgressObserver } from "./components";
import classes from "./BookCard.module.css";

interface BookCardProps {
    bookKey: BookKey;
    onClick?: () => void;
    visible?: boolean;
}

export const BookCard = observer(({ bookKey, onClick, visible = true }: BookCardProps) => {
    const bookStore = useBookStore();
    const bookReadStore = useBookReadStore();
    const metadata = bookStore.getBookMetadata(bookKey, true);
    const { isMetadataParsed } = bookStore.getBookState(bookKey);

    const openedTimeAgoStr = bookReadStore.getOpenedTimeAgo(bookKey);

    const [openedSummary, { open: openSummary, close: closeSummary }] = useDisclosure(false);
    const [openedAbout, { open: openAbout, close: closeAbout }] = useDisclosure(false);
    const handleDelete = () => context.deleteFile(bookKey);

    const menuItems = [
        { label: "About", Icon: IconInfoCircle, onClick: openAbout, onClose: closeAbout },
        {
            label: "Summary (AI)",
            Icon: IconRobot,
            onClick: openSummary,
            onClose: closeSummary,
        },
        {
            label: "Delete",
            Icon: IconTrash,
            onClick: handleDelete,
            props: {
                color: "red",
            },
        },
    ];

    if (!visible) return <></>;
    return (
        <motion.div
            layout
            layoutId={bookKey}
            className={classes.link}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={onClick}
        >
            <Link
                disabled={!visible}
                className={classes.link}
                to={bookKeyRoute.to}
                params={{
                    bookKey,
                }}
            >
                <Indicator disabled={openedTimeAgoStr !== "never" || !isMetadataParsed}>
                    <Paper
                        shadow="md"
                        p="md"
                        radius="md"
                        className={classes.card}
                        style={{ backgroundImage: `url(${metadata.cover})` }}
                    >
                        <div>
                            <TextObserver className={classes.category} size="xs">
                                {() => metadata.author}
                            </TextObserver>
                        </div>
                        <Group
                            justify="space-between"
                            w="100%"
                            wrap="nowrap"
                            h="3rem"
                            onClick={(e) => e.preventDefault()}
                        >
                            <Paper
                                color="cyan.3"
                                style={{ flexGrow: 1 }}
                                h="100%"
                                p="0.5rem"
                                styles={{ root: { display: "flex", position: "relative" } }}
                            >
                                <TitleObserver order={3} className={classes.title}>
                                    {() => metadata.title}
                                </TitleObserver>
                            </Paper>
                            <BookMenu items={menuItems} />
                        </Group>
                        <ProgressObserver
                            className={classes.progress}
                            title="Reading"
                            size="sm"
                            getValue={() => bookReadStore.getLastKnownProgress(bookKey) * 100}
                        />
                    </Paper>
                </Indicator>
            </Link>
            <SummaryModal
                getTitle={() => metadata.title}
                getAuthor={() => metadata.author}
                opened={openedSummary}
                onClose={closeSummary}
            />
            <AboutModal bookKey={bookKey} opened={openedAbout} onClose={closeAbout} />
        </motion.div>
    );
});
