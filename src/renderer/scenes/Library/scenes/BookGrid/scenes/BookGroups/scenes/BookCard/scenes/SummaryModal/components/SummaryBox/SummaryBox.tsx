import React, { useState } from "react";
import { Paper, Text, Button, Group, Container } from "@mantine/core";
import { IconBaselineDensityMedium, IconBaselineDensitySmall } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import Markdown from "react-markdown";

import { Combobox } from "~/renderer/components";
import { useSettingsStore } from "~/renderer/stores";
import flags from "~/assets/images/flags/language";
import context from "~/renderer/ipc/thirdPartyApi";
import classes from "./SummaryBox.module.css";
import { useYandexCloudIamAuth } from "~/renderer/hooks";

const selectLanguageData = [
    { value: "en", label: "English", image: flags.en },
    { value: "ru", label: "Russian", image: flags.ru },
];
const selectLengthData = [
    { value: "short", label: "Short", Icon: IconBaselineDensityMedium },
    { value: "long", label: "Long", Icon: IconBaselineDensitySmall },
];

type Language = "English" | "Russian";
type TextLength = "Long" | "Short";

const makeSystemPrompt = (language: Language, length: TextLength) => {
    if (language === "English") {
        let prompt = `Respond in English. Make summaries about books based on provided titles and authors. Break your text into paragraphs. Use markdown to format the response. `;
        if (length === "Long") {
            prompt += "Recap must be around 150 words or 2 paragraphs. ";
        } else if (length === "Short") {
            prompt += "Recap must be around 50 words or 3-4 paragraphs. ";
        }
        return prompt.trim();
    } else if (language === "Russian") {
        let prompt = `Отвечай на русском языке. Создавай краткие пересказы о книгах на основе предоставленных названий и авторах. Разбивай текст на абзацы. Используй маркдаун чтобы оформить ответ. `;
        if (length === "Long") {
            prompt += "Краткое содержание должно быть около 150 слов или 2 абзаца. ";
        } else if (length === "Short") {
            prompt += "Краткое содержание должно быть около 50 слов или 3-4 абзаца. ";
        }
        return prompt.trim();
    }
};

const makeUserPrompt = (bookTitle: string, bookAuthor: string, language: Language) => {
    if (language === "English") {
        return `Make a short summary in English of a book called "${bookTitle}" by "${bookAuthor}"`;
    } else if (language === "Russian") {
        return `Сделай краткое содержание для книги "${bookTitle}" от "${bookAuthor}"`;
    }
};

const yandexFolderIdSettingKeyList = ["General", "API", "AI", "Yandex Cloud folder ID"];

interface SummaryBoxProps {
    getTitle: () => string;
    getAuthor: () => string;
}

export const SummaryBox = observer(({ getTitle, getAuthor }: SummaryBoxProps) => {
    const [selectedLangValue, setSelectedLang] = useState(selectLanguageData[0].value);
    const [selectedLenValue, setSelectedLen] = useState(selectLengthData[0].value);

    const selectedLang = selectLanguageData.find(({ value }) => value === selectedLangValue);
    const selectedLen = selectLengthData.find(({ value }) => value === selectedLenValue);

    const { getSetting } = useSettingsStore();

    const title = getTitle();
    const authors = getAuthor();

    const { yandexOauthToken, iamToken, iamTokenError } = useYandexCloudIamAuth();
    const yandexFolderId = getSetting(yandexFolderIdSettingKeyList).value;

    const { data, isPending, error, isFetching, isSuccess, refetch } = useQuery({
        queryKey: [
            "yandexGpt",
            selectedLang.label,
            selectedLen.label,
            title,
            authors,
            iamToken,
            yandexFolderId,
        ] as [string, Language, TextLength, string, string, string, string],
        queryFn: ({
            queryKey: [_, language, length, title, authors, iamToken, yandexFolderId],
        }) => {
            const systemPrompt = makeSystemPrompt(language, length);
            const userPrompt = makeUserPrompt(title, authors, language);

            return context.apiYandexgpt(systemPrompt, userPrompt, iamToken, yandexFolderId);
        },
        enabled: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: Boolean(iamToken),
    });
    const readyToGenerate = iamToken && yandexFolderId;

    return (
        <Container p="lg" h="100%">
            <Group mb="md">
                <Button size="md" onClick={() => refetch()} disabled={!readyToGenerate}>
                    Generate
                </Button>
                <Combobox
                    data={selectLanguageData}
                    selected={selectedLangValue}
                    onChange={setSelectedLang}
                />
                <Combobox
                    data={selectLengthData}
                    selected={selectedLenValue}
                    onChange={setSelectedLen}
                />
            </Group>
            <Paper py="xl" px="md" classNames={{ root: classes.paperRoot }}>
                {!yandexOauthToken && (
                    <Text c="red">
                        Please enter Yandex Cloud Oauth Token in the settings to continue.
                    </Text>
                )}
                {!yandexFolderId && (
                    <Text c="red">
                        Please enter Yandex Cloud folder ID in the settings to continue.
                    </Text>
                )}
                {iamTokenError && (
                    <Text c="red">Yandex Cloud Oauth Token is either invalid or has expired.</Text>
                )}

                {readyToGenerate &&
                    isPending &&
                    !isFetching &&
                    `Press 'generate' to generate a ${selectedLang.label.toLowerCase()} summary in ${
                        selectedLen.label
                    } for the "${title}".`}
                {isFetching && "Generating..."}
                {error && <Text c="red">{`An error has occurred: ${error.message}`}</Text>}

                {isSuccess && !isFetching && <Markdown>{data}</Markdown>}
            </Paper>
        </Container>
    );
});
