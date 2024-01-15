import React, { useState } from "react";
import {
    Paper,
    Text,
    Title,
    Button,
    Group,
    Menu,
    rem,
    ActionIcon,
    Modal,
    Container,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2, IconRobot, IconTrash } from "@tabler/icons-react";

import sampleCover from "~/assets/images/sampleBookCover.avif";
import classes from "./BookCard.module.css";
import type { Metadata } from "../hooks";
import context from "../ipc";
import { LanguagePicker } from "~/components/LanguagePicker";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const provideFallbackCover = (cover: string) => {
    if (!cover || cover === "unkown") return sampleCover;
    return cover;
};

const provideFallbackTitle = (title: any, filename: string) => {
    if (typeof title === "object" && "_" in title) return title?._ ?? filename;
    if (typeof title === "string" && title) return title;
    return filename;
};

const provideFallbackAuthors = (authors: any) => {
    if (typeof authors === "object" && "_" in authors) return authors?._ ?? "Unknown";
    if (typeof authors === "string" && authors) return authors;
    return "Unknown";
};

const makePrompt = (title: string, authors: string, language: "English" | "Russian") => {
    if (language === "English") {
        return `Make a short summary in English of a book called "${title}" by "${authors}". Use new lines and correct punctuation. Summary must be around 150 words.`;
    }
    if (language === "Russian") {
        return "";
    }
};

// TODO refactor into several components
// TODO persist summaries https://tanstack.com/query/v4/docs/react/plugins/persistQueryClient
export const BookCard = ({
    filename,
    metadata,
    skeleton = false,
}: {
    filename: string;
    metadata: Metadata;
    skeleton: boolean;
}) => {
    const cover = provideFallbackCover(metadata.cover);
    const title = provideFallbackTitle(metadata.title, filename);
    const authors = provideFallbackAuthors(metadata.author);

    const selectLanguageData = [
        { label: "English", image: "" },
        { label: "Russian", image: "" },
    ];
    const handleDelete = () => {
        context.deleteFile(filename);
    };

    const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [selected, setSelected] = useState(selectLanguageData[0]);

    const { isPending, error, data, isFetching, isSuccess, refetch } = useQuery({
        queryKey: ["yandexGpt", selected.label, title, authors],
        queryFn: ({ queryKey: [_, language, title, authors] }) => {
            const prompt = makePrompt(title, authors, language);
            return context.apiYandexgpt(prompt);
        },
        enabled: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
    });

    return (
        <>
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
                <Group justify="space-between" w="100%" wrap="nowrap" h="3rem">
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
                    <Menu shadow="md" width={180} position="top-end" closeOnItemClick>
                        <Menu.Target>
                            <ActionIcon size="3rem" aria-label="Menu" variant="default">
                                <IconMenu2 style={{ width: "70%", height: "70%" }} stroke={1.5} />
                            </ActionIcon>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <Menu.Item
                                onClick={openModal}
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

            <Modal
                styles={{
                    body: {
                        height: `calc(100% - ${rem(64)})`,
                    },
                    header: {
                        padding: "var(--mantine-spacing-xs)",
                    },
                    title: {
                        paddingLeft: "var(--mantine-spacing-md)",
                    },
                }}
                title={
                    <Group p={0}>
                        <IconRobot style={{ width: rem(20), height: rem(20) }} strokeWidth={2.5} />
                        <Title order={1} size="h4" fw={600}>
                            {`Summary of ${title} book`}
                        </Title>
                    </Group>
                }
                opened={openedModal}
                onClose={closeModal}
            >
                <Container p="lg" h="100%">
                    <Group mb="md">
                        <Button size="md" onClick={() => refetch()}>
                            Generate
                        </Button>
                        <LanguagePicker
                            data={selectLanguageData}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </Group>
                    <Paper py="xl" px="md" classNames={{ root: classes.modalPaper }}>
                        {isPending &&
                            !isFetching &&
                            `Press 'generate' to generate a summary for the book ${title}.`}
                        {isFetching && "Generating..."}
                        {error && <Text c="red">{"An error has occurred: " + error.message}</Text>}
                        {isSuccess && <Text>{data}</Text>}
                    </Paper>
                </Container>
            </Modal>
        </>
    );
};
