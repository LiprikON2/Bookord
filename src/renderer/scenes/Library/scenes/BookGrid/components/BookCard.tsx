import React from "react";
import { Paper, Text, Title, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";

import context from "~/renderer/ipc/fileOperations";
import { BookKey, useBookMetadata } from "~/renderer/stores";
import { bookKeyRoute } from "~/renderer/appRenderer";
import { BookMenu, SummaryModal } from "./components";
import classes from "./BookCard.module.css";

export const BookCard = ({ bookKey, visible = true }: { bookKey: BookKey; visible: boolean }) => {
    const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);

    const metadata = useBookMetadata(bookKey);

    const handleDelete = () => context.deleteFile(bookKey);

    if (!visible) return <></>;
    return (
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
                    <Text className={classes.category} size="xs">
                        {metadata.authors}
                    </Text>
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
                        <Title order={3} className={classes.title}>
                            {metadata.title}
                        </Title>
                    </Paper>
                    <BookMenu handleDelete={handleDelete} openModal={openModal} />
                </Group>
            </Paper>
            <SummaryModal
                title={metadata.title}
                authors={metadata.authors}
                opened={openedModal}
                onClose={closeModal}
            />
        </Link>
    );
};
