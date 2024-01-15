import React from "react";
import { Paper, Text, Title, Button } from "@mantine/core";

import sampleCover from "~/assets/images/sampleBookCover.avif";
import classes from "./BookCard.module.css";
import type { Metadata } from "../hooks";

const provideFallbackCover = (cover: string) => {
    if (!cover || cover === "unkown") return sampleCover;
    return cover;
};

const provideFallbackTitle = (title: any, filename: string) => {
    if (typeof title === "object" && "_" in title) return title?._ ?? filename;
    if (typeof title === "string") return title;
    return filename;
};

export const BookCard = ({
    filename,
    metadata,
    skeleton,
}: {
    filename: string;
    metadata: Metadata;
    skeleton: boolean;
}) => {
    return (
        <Paper
            shadow="md"
            p="md"
            radius="md"
            className={classes.card}
            style={{ backgroundImage: `url(${provideFallbackCover(metadata.cover)})` }}
        >
            <div>
                <Text className={classes.category} size="xs">
                    {metadata.author}
                </Text>
                <Title order={3} className={classes.title}>
                    {skeleton ? filename : provideFallbackTitle(metadata.title, filename)}
                </Title>
            </div>
            <Button variant="white" color="dark">
                Read article
            </Button>
        </Paper>
    );
};
