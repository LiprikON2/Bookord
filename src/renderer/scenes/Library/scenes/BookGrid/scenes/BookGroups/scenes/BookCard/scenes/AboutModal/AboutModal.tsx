import React from "react";
import {
    Container,
    Modal,
    Paper,
    rem,
    ThemeIcon,
    ScrollArea,
    Divider,
    CloseButton,
    Group,
} from "@mantine/core";
import { IconNotebook } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { BookKey, useBookReadStore, useBookStore, useBookViewStore } from "~/renderer/stores";
import { Giscus, Skeletonize } from "~/renderer/components";
import { DatesGroup, DescriptionGroup, ProgressGroup, TagsGroup, TitleGroup } from "./components";
import classes from "./AboutModal.module.css";

interface AboutModalProps {
    bookKey: BookKey;
    opened?: boolean;
    onClose?: () => void;
}
export const AboutModal = observer(({ bookKey, opened = false, onClose }: AboutModalProps) => {
    const bookStore = useBookStore();
    const metadata = bookStore.getBookMetadata(bookKey, true);

    const bookReadStore = useBookReadStore();
    const bookViewStore = useBookViewStore();
    const handleAuthorClick = () => {
        bookViewStore.setSearch(metadata.author);
        onClose();
    };

    const { setActiveTag: setActiveSubjectTag, getCategoryName: getSubjectCategoryName } =
        bookViewStore.useTags("subjects");
    const handleSubjectClick = (subject: string) => {
        bookViewStore.resetTags();
        setActiveSubjectTag(subject, true);
        onClose();
    };

    const { setActiveTag: setActiveYearTag, getCategoryName: getYearCategoryName } =
        bookViewStore.useTags("publishYears");
    const handleYearClick = (year: string) => {
        bookViewStore.resetTags();
        setActiveYearTag(year, true);
        onClose();
    };

    const { setActiveTag: setActiveLanuageTag, getCategoryName: getLanguageCategoryName } =
        bookViewStore.useTags("languages");
    const handleLanguageClick = (language: string) => {
        bookViewStore.resetTags();
        setActiveLanuageTag(language, true);
        onClose();
    };

    const { isMetadataParsed } = bookStore.getBookState(bookKey);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            aria-label="About book"
            scrollAreaComponent={ScrollArea.Autosize}
            withCloseButton={false}
            fullScreen
            classNames={{ content: classes.content }}
            onClick={onClose}
        >
            <Container p="lg" pt={0} h="100%" size="xs" onClick={(e) => e.stopPropagation()}>
                <Paper radius="md" withBorder className={classes.card} mt={20}>
                    <ThemeIcon className={classes.icon} size={60} radius={60}>
                        <IconNotebook style={{ width: rem(32), height: rem(32) }} stroke={1.5} />
                    </ThemeIcon>
                    <CloseButton onClick={onClose} className={classes.closeButton} />

                    <TitleGroup
                        isAuthorVisible={isMetadataParsed}
                        metadata={metadata}
                        onAuthorClick={handleAuthorClick}
                    />

                    <Skeletonize visible={isMetadataParsed} skeletonCount={2}>
                        <ProgressGroup
                            getProgress={() => bookReadStore.getLastKnownProgress(bookKey)}
                            getProgressStr={() => bookReadStore.getProgress(bookKey)}
                            getReadTimeStr={() => bookReadStore.getReadTime(bookKey)}
                            getOpenedTimeAgoStr={() => bookReadStore.getOpenedTimeAgo(bookKey)}
                        />
                    </Skeletonize>

                    <Divider my="lg" label="Date stats" labelPosition="center" />
                    <Skeletonize visible={isMetadataParsed} skeletonCount={2}>
                        <DatesGroup
                            getPublishDate={() => bookReadStore.getPublishDate(bookKey)}
                            getAddedDate={() => bookReadStore.getAddedDate(bookKey)}
                            getOpenedDate={() => bookReadStore.getOpenedDate(bookKey)}
                        />
                    </Skeletonize>

                    <Divider my="lg" label="Tags" labelPosition="center" />
                    <Skeletonize visible={isMetadataParsed} skeletonCount={2}>
                        <Group mt="md">
                            <TagsGroup
                                getName={getSubjectCategoryName}
                                getTagNames={() => metadata.subjects}
                                onTagClick={handleSubjectClick}
                            />
                            <TagsGroup
                                getName={getYearCategoryName}
                                getTagNames={() => bookViewStore.getBookYears(bookKey)}
                                onTagClick={handleYearClick}
                            />
                            <TagsGroup
                                getName={getLanguageCategoryName}
                                getTagNames={() => bookViewStore.getBookLanguages(bookKey)}
                                onTagClick={handleLanguageClick}
                            />
                        </Group>
                    </Skeletonize>

                    <Divider my="lg" label="Description" labelPosition="center" />
                    <Skeletonize visible={isMetadataParsed}>
                        <DescriptionGroup metadata={metadata} />
                    </Skeletonize>
                </Paper>
            </Container>
        </Modal>
    );
});
