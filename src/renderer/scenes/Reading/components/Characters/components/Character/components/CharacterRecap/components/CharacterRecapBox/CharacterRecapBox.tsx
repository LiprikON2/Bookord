import React, { useState } from "react";
import { Button, Container, Group, Paper, Text } from "@mantine/core";
import { IconBaselineDensityMedium, IconBaselineDensitySmall } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";
import Markdown from "react-markdown";
import { useQuery } from "@tanstack/react-query";

import context from "~/renderer/ipc/thirdPartyApi";
import flags from "~/assets/images/flags/language";
import { Person, useBookReadStore, useSettingsStore } from "~/renderer/stores";
import { LanguagePicker } from "~/renderer/components";
import classes from "./CharacterRecapBox.module.css";
import { useYandexCloudIamAuth } from "~/renderer/hooks";

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

const makeSystemPrompt = (language: Language, length: TextLength) => {
    if (language === "English") {
        let prompt = `Respond in English. Make recaps about book characters based on provided context. Avoid describing what they have done and go more into detail about who they are and what their relationships with other characters are. Use new lines, denoted by "\\n" (unicode newline character). Use markdown to format the response. `;
        if (length === "Long") {
            prompt += "Recap must be around 150 words or 2 paragraphs. ";
        } else if (length === "Short") {
            prompt += "Recap must be around 50 words or 3-4 paragraphs. ";
        }
        return prompt.trim();
    } else if (language === "Russian") {
        let prompt = `Отвечай на русском языке. Делай краткие описания персонажей на основе предоставленного контекста. Избегай описаний того что делал персонаж и больше уделяй внимания созданию характеристики персонажа и описание его отношений с другими персонажами. Используй переходы на новые строки, обозначаемые "\\n" (юникод символом новой строки). Используй маркдаун чтобы оформить ответ. `;
        if (length === "Long") {
            prompt += "Краткое содержание должно быть около 150 слов или 2 абзаца. ";
        } else if (length === "Short") {
            prompt += "Краткое содержание должно быть около 50 слов или 3-4 абзаца. ";
        }
        return prompt.trim();
    }
};

const makeUserPrompt = (
    bookTitle: string,
    characterName: string,
    context: string,
    language: Language
) => {
    if (language === "English") {
        return `Make a short recap in English of a character called "${characterName}" from a book "${bookTitle}". Use these excerpts as a context:\n\n ${context}`;
    } else if (language === "Russian") {
        return `Сделай краткое описание персонажа "${characterName}" из книги "${bookTitle}". Используй эти выдержки в качестве контекста:\n\n ${context}`;
    }
};

const yandexFolderIdSettingKeyList = ["General", "API", "AI", "Yandex Cloud folder ID"];

interface CharacterRecapBoxProps {
    person: Person;
    //
}

export const CharacterRecapBox = observer(({ person }: CharacterRecapBoxProps) => {
    const [selectedLang, setSelectedLang] = useState(selectLanguageData[0]);
    const [selectedLen, setSelectedLen] = useState(selectLengthData[0]);

    const bookReadStore = useBookReadStore();
    const contextString = bookReadStore.getPersonContextRecords(person.uniqueName).join("\n");

    const bookTitle = bookReadStore.metadata.title;

    const { getSetting } = useSettingsStore();

    const { yandexOauthToken, iamToken, iamTokenError } = useYandexCloudIamAuth();
    const yandexFolderId = getSetting(yandexFolderIdSettingKeyList).value;

    const { data, isPending, error, isFetching, isSuccess, refetch } = useQuery({
        queryKey: [
            "yandexGpt",
            selectedLang.label,
            selectedLen.label,
            bookTitle,
            person.displayName,
            contextString,
            iamToken,
            yandexFolderId,
        ] as [string, Language, TextLength, string, string, string, string, string],
        queryFn: ({
            queryKey: [
                _,
                language,
                length,
                bookTitle,
                displayName,
                contextString,
                iamToken,
                yandexFolderId,
            ],
        }) => {
            const systemPrompt = makeSystemPrompt(language, length);
            const userPrompt = makeUserPrompt(bookTitle, displayName, contextString, language);

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
                <LanguagePicker
                    data={selectLanguageData}
                    selected={selectedLang}
                    onSelect={setSelectedLang}
                />
                <LanguagePicker
                    data={selectLengthData}
                    selected={selectedLen}
                    onSelect={setSelectedLen}
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
                    `Press 'generate' to generate a ${selectedLen.label.toLowerCase()} recap in ${
                        selectedLang.label
                    } for the "${person.displayName}" character.`}
                {isFetching && "Generating..."}
                {error && <Text c="red">{"An error has occurred: " + error.message}</Text>}
                {isSuccess && !isFetching && <Markdown>{data}</Markdown>}
            </Paper>
        </Container>
    );
});
