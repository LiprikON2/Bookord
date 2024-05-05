import React from "react";
import { Paper, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";

import context from "~/renderer/ipc/fileOperations";
import { TitleObserver, TextObserver } from "~/renderer/components";
import { BookKey, useBookStore } from "~/renderer/stores";
import { bookKeyRoute } from "~/renderer/appRenderer";
import { BookMenu, SummaryModal } from "./scenes";
import classes from "./BookCard.module.css";

interface BookCardProps {
    bookKey: BookKey;
    onClick?: () => void;
    visible?: boolean;
}

export const BookCard = observer(({ bookKey, onClick, visible = true }: BookCardProps) => {
    const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);

    const bookStore = useBookStore();
    const metadata = bookStore.getBookMetadata(bookKey, true);

    const handleDelete = () => context.deleteFile(bookKey);

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
                            styles={{ root: { display: "flex" } }}
                        >
                            <TitleObserver order={3} className={classes.title}>
                                {() => metadata.title}
                            </TitleObserver>
                        </Paper>
                        <BookMenu handleDelete={handleDelete} openModal={openModal} />
                    </Group>
                </Paper>
            </Link>
            <SummaryModal
                getTitle={() => metadata.title}
                getAuthor={() => metadata.author}
                opened={openedModal}
                onClose={closeModal}
            />
        </motion.div>
    );
});
