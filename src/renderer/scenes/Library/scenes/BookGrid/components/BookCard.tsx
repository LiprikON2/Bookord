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

import sampleCover from "~/assets/images/sampleBookCover.webp";
import classes from "./BookCard.module.css";
import type { Metadata } from "../hooks";
import context from "../ipc";
import { LanguagePicker } from "~/components/LanguagePicker";
import { useQuery } from "@tanstack/react-query";
import { getSetting } from "~/renderer/store";

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

type Language = "English" | "Russian";
type TextLength = "Long" | "Short";

const makePrompt = (title: string, authors: string, language: Language, length: TextLength) => {
    if (language === "English") {
        let lengthPrompt;
        if (length === "Long") {
            lengthPrompt = "Summary must be around 150 words or 2 paragraphs.";
        } else if (length === "Short") {
            lengthPrompt = "Summary must be around 50 words or 3-4 paragraphs.";
        } else {
            throw Error(`Length ${length} is not recognized`);
        }
        return `Make a short summary in English of a book called "${title}" by "${authors}". Use new lines, denoted by "\n". ${lengthPrompt}`;
    } else if (language === "Russian") {
        let lengthPrompt;
        if (length === "Long") {
            lengthPrompt = "Краткое содержание должно быть около 150 слов или 2 абзаца.";
        } else if (length === "Short") {
            lengthPrompt = "Краткое содержание должно быть около 50 слов или 3-4 абзаца.";
        } else {
            throw Error(`Length ${length} is not recognized`);
        }
        return `Сделай краткое содержание для книги "${title}" от "${authors}". Испольуй переходы на новые строки обозначаемые "\n". ${lengthPrompt}`;
    } else {
        throw Error(`Language ${language} is not recognized`);
    }
};

const yandexIamTokenSettingKeyList = ["General", "API", "AI", "YandexGPT API IAM token"];
const yandexFolderIdSettingKeyList = ["General", "API", "AI", "YandexGPT API folder ID"];

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
    const selectLengthData = [
        { label: "Short", image: "" },
        { label: "Long", image: "" },
    ];
    const handleDelete = () => {
        context.deleteFile(filename);
    };

    const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);
    const [selectedLang, setSelectedLang] = useState(selectLanguageData[0]);
    const [selectedLen, setSelectedLen] = useState(selectLengthData[0]);

    const { isPending, error, data, isFetching, isSuccess, refetch } = useQuery({
        queryKey: ["yandexGpt", selectedLang.label, selectedLen.label, title, authors] as [
            "yandexGpt",
            Language,
            TextLength,
            string,
            string
        ],
        queryFn: ({ queryKey: [_, language, length, title, authors] }) => {
            const prompt = makePrompt(title, authors, language, length);
            const yandexIamToken = getSetting(yandexIamTokenSettingKeyList).value;
            const yandexFolderId = getSetting(yandexFolderIdSettingKeyList).value;
            return context.apiYandexgpt(prompt, yandexIamToken, yandexFolderId);
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
                            selected={selectedLang}
                            setSelected={setSelectedLang}
                        />
                        <LanguagePicker
                            data={selectLengthData}
                            selected={selectedLen}
                            setSelected={setSelectedLen}
                        />
                    </Group>
                    <Paper py="xl" px="md" classNames={{ root: classes.modalPaper }}>
                        {isPending &&
                            !isFetching &&
                            `Press 'generate' to generate a ${selectedLen.label.toLowerCase()} summary in ${
                                selectedLang.label
                            } for the "${title}".`}
                        {isFetching && "Generating..."}
                        {error && <Text c="red">{"An error has occurred: " + error.message}</Text>}
                        {isSuccess && !isFetching && <Text>{data}</Text>}
                    </Paper>
                </Container>
            </Modal>
        </>
    );
};
