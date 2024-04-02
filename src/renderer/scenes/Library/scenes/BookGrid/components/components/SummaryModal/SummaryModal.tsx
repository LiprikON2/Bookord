import React, { useState } from "react";
import { Paper, Text, Title, Button, Group, rem, Modal, Container } from "@mantine/core";
import {
    IconBaselineDensityMedium,
    IconBaselineDensitySmall,
    IconRobot,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

import { LanguagePicker } from "~/components/LanguagePicker";
import { getSetting } from "~/renderer/stores";
import flags from "~/assets/images/flags/language";
import classes from "./SummaryModal.module.css";
import context from "~/renderer/ipc/thirdPartyApi";

const selectLanguageData = [
    { label: "English", image: flags.en },
    { label: "Russian", image: flags.ru },
];
const selectLengthData = [
    { label: "Short", image: "", Icon: IconBaselineDensityMedium },
    { label: "Long", image: "", Icon: IconBaselineDensitySmall },
];

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

interface SummaryModalProps {
    title: string;
    authors: string;
    opened: boolean;
    onClose?: () => void;
}

// TODO persist summaries https://tanstack.com/query/v4/docs/react/plugins/persistQueryClient

export const SummaryModal = ({ opened = false, title, authors, onClose }: SummaryModalProps) => {
    const [selectedLang, setSelectedLang] = useState(selectLanguageData[0]);
    const [selectedLen, setSelectedLen] = useState(selectLengthData[0]);

    const { data, isPending, error, isFetching, isSuccess, refetch } = useQuery({
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
            opened={opened}
            onClose={onClose}
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
                <Paper py="xl" px="md" classNames={{ root: classes.paperRoot }}>
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
    );
};
