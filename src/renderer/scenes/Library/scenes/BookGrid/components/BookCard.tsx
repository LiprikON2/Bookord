import React from "react";
import { Paper, Text, Title, Button, Group, Menu, rem, ActionIcon } from "@mantine/core";

import sampleCover from "~/assets/images/sampleBookCover.avif";
import classes from "./BookCard.module.css";
import type { Metadata } from "../hooks";
import { IconMenu2, IconRobot, IconTrash } from "@tabler/icons-react";
import context from "../ipc";

const provideFallbackCover = (cover: string) => {
    if (!cover || cover === "unkown") return sampleCover;
    return cover;
};

const provideFallbackTitle = (title: any, filename: string) => {
    if (typeof title === "object" && "_" in title) return title?._ ?? filename;
    if (typeof title === "string" && title) return title;
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
    const handleDelete = () => {
        context.deleteFile(filename);
    };
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
            </div>
            <Group justify="space-between" w="100%" wrap="nowrap" h="3rem">
                <Paper
                    color="cyan.3"
                    style={{ flexGrow: 1 }}
                    h="100%"
                    p="0.5rem"
                    styles={{ root: { display: "flex" } }}
                >
                    <Title order={3} className={classes.title}>
                        {provideFallbackTitle(metadata.title, filename)}
                    </Title>
                </Paper>
                <Menu shadow="md" width={180} position="top-end" closeOnItemClick>
                    <Menu.Target>
                        <ActionIcon size="3rem" aria-label="Menu" variant="default">
                            <IconMenu2 style={{ width: "70%", height: "70%" }} stroke={1.5} />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            leftSection={<IconRobot style={{ width: "70%", height: "70%" }} />}
                        >
                            Summary (AI)
                        </Menu.Item>

                        <Menu.Divider />
                        <Menu.Item
                            onClick={handleDelete}
                            color="red"
                            leftSection={<IconTrash style={{ width: "70%", height: "70%" }} />}
                        >
                            Delete
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </Group>
        </Paper>
    );
};
