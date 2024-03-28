import React from "react";
import { Paper, Text, Title, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";

import { bookKeyRoute } from "~/renderer/appRenderer";
import sampleCover from "~/assets/images/sampleBookCover.webp";
import { type Metadata } from "~/renderer/store";
import context from "../ipc";
import { BookMenu, SummaryModal } from "./components";
import classes from "./BookCard.module.css";

const provideFallbackCover = (cover: string): string => {
    if (!cover || cover === "unkown") return sampleCover;
    return cover;
};

const provideFallbackTitle = (title: any, filename: string): string => {
    if (typeof title === "object" && "_" in title) return title?._ ?? filename;
    if (typeof title === "string" && title) return title;
    return filename;
};

const provideFallbackAuthors = (authors: any): string => {
    if (typeof authors === "object" && "_" in authors) return authors?._ ?? "Unknown";
    if (typeof authors === "string" && authors) return authors;
    return "Unknown";
};

export const BookCard = ({
    filename,
    metadata,
    skeleton = false,
}: {
    filename: string;
    metadata: Metadata;
    skeleton: boolean;
}) => {
    const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);

    const handleDelete = () => {
        context.deleteFile(filename);
    };

    const cover = provideFallbackCover(metadata.cover);
    const title = provideFallbackTitle(metadata.title, filename);
    const authors = provideFallbackAuthors(metadata.author);

    return (
        <Link
            className={classes.link}
            to={bookKeyRoute.to}
            params={{
                bookKey: filename,
            }}
            key={filename}
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
                        {metadata.author}
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
};
