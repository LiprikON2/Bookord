import React from "react";
import { Paper, Text, Title, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";
import { observer } from "mobx-react-lite";

import context from "~/renderer/ipc/fileOperations";
import { bookStore, type BookMetadata, BookKey } from "~/renderer/store";
import { bookKeyRoute } from "~/renderer/appRenderer";
import sampleCover from "~/assets/images/sampleBookCover.webp";
import { BookMenu, SummaryModal } from "./components";
import { useStorageBooks } from "~/renderer/hooks";
import classes from "./BookCard.module.css";

const provideFallbackCover = (cover?: string): string => {
    if (!cover || cover === "unkown") return sampleCover;
    return cover;
};

const provideFallbackTitle = (filename: string, title?: any): string => {
    if (typeof title === "object" && "_" in title) return title?._ ?? filename;
    if (typeof title === "string" && title) return title;
    return filename;
};

const provideFallbackAuthors = (authors?: any): string => {
    if (typeof authors === "object" && "_" in authors) return authors?._ ?? "Unknown";
    if (typeof authors === "string" && authors) return authors;
    return "Unknown";
};

export const BookCard = observer(
    ({ bookKey, skeleton = false }: { bookKey: BookKey; skeleton: boolean }) => {
        const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);

        const handleDelete = () => {
            context.deleteFile(bookKey);
        };

        const metadataRecord = bookStore.getBookMetadata(bookKey);
        const cover = provideFallbackCover(metadataRecord?.cover);
        const title = provideFallbackTitle(bookKey, metadataRecord?.title);
        const authors = provideFallbackAuthors(metadataRecord?.author);

        return (
            <Link
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
                    style={{ backgroundImage: `url(${cover})` }}
                >
                    <div>
                        <Text className={classes.category} size="xs">
                            {authors}
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
                                {title}
                            </Title>
                        </Paper>
                        <BookMenu handleDelete={handleDelete} openModal={openModal} />
                    </Group>
                </Paper>
                <SummaryModal
                    title={title}
                    authors={authors}
                    opened={openedModal}
                    onClose={closeModal}
                />
            </Link>
        );
    }
);
