import React from "react";
import { Paper, Text, Title, Button } from "@mantine/core";

import sampleCover from "~/assets/images/sampleBookCover.avif";
import classes from "./BookCard.module.css";

export const BookCard = () => {
    return (
        <Paper
            shadow="md"
            p="md"
            radius="md"
            className={classes.card}
            style={{ backgroundImage: `url(${sampleCover})` }}
        >
            <div>
                <Text className={classes.category} size="xs">
                    nature
                </Text>
                <Title order={3} className={classes.title}>
                    Best forests to visit in North America
                </Title>
            </div>
            <Button variant="white" color="dark">
                Read article
            </Button>
        </Paper>
    );
};
