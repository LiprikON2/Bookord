import React from "react";
import {
    Button,
    Text,
    Container,
    Group,
    Modal,
    Paper,
    Title,
    rem,
    ThemeIcon,
    Progress,
    Badge,
    Divider,
    ScrollArea,
    SimpleGrid,
    TypographyStylesProvider,
} from "@mantine/core";
import { observer } from "mobx-react-lite";

import { BookKey, useBookReadStore, useBookStore } from "~/renderer/stores";
import { IconNotebook } from "@tabler/icons-react";
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
    const progress = bookReadStore.getLastKnownProgress(bookKey);
    const progressStr = bookReadStore.getProgress(bookKey);
    const time = bookReadStore.getReadTime(bookKey);
    const openedTimeAgo = bookReadStore.getOpenedTimeAgo(bookKey);
    const openedDate = bookReadStore.getOpenedDate(bookKey);
    const addedDate = bookReadStore.getAddedDate(bookKey);
    const publishDate = bookReadStore.getPublishDate(bookKey);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            size="lg"
            aria-label="About book"
            scrollAreaComponent={ScrollArea.Autosize}
            withCloseButton={false}
        >
            <Container p="lg" pt={0} h="100%">
                <Paper radius="md" withBorder className={classes.card} mt={20}>
                    <ThemeIcon className={classes.icon} size={60} radius={60}>
                        <IconNotebook style={{ width: rem(32), height: rem(32) }} stroke={1.5} />
                    </ThemeIcon>

                    <Text ta="center" fw={700} size="lg" className={classes.title}>
                        {metadata.title}
                    </Text>
                    <Text c="dimmed" ta="center" fz="sm">
                        by {metadata.author}
                    </Text>

                    <Group justify="space-between" mt="xs">
                        <Text fz="sm" c="dimmed">
                            Reading progress
                        </Text>
                        <Text fz="sm" c="dimmed">
                            {progressStr}
                        </Text>
                    </Group>

                    <Progress value={progress * 100} mt={5} />

                    <Group justify="space-between" mt="md">
                        <Text fz="sm">
                            {openedTimeAgo === "never" ? (
                                "Never opened"
                            ) : (
                                <>
                                    Last opened{" "}
                                    <Text span inherit fw={600}>
                                        {openedTimeAgo}
                                    </Text>
                                </>
                            )}
                        </Text>
                        <Badge size="md">{time}</Badge>
                    </Group>

                    <Divider my="lg" label="Description" labelPosition="center" />
                    <Group mt="md">
                        <TypographyStylesProvider>
                            <div dangerouslySetInnerHTML={{ __html: metadata.description }} />
                        </TypographyStylesProvider>
                    </Group>

                    <Divider my="lg" label="Genres" labelPosition="center" />
                    <Group mt="md">
                        {metadata.subjects.map((subject) => (
                            <Badge key="subject" size="sm">
                                {subject}
                            </Badge>
                        ))}
                    </Group>

                    <Divider my="lg" label="Date stats" labelPosition="center" />
                    <SimpleGrid cols={2} mt="md">
                        <Text fz="sm">Publish date: {publishDate ?? "Unknown"}</Text>
                        <Text fz="sm">Added date: {addedDate ?? "Unknown"}</Text>
                        <Text fz="sm" />
                        <Text fz="sm">Last opened date: {openedDate ?? "Never"}</Text>
                    </SimpleGrid>
                </Paper>
            </Container>
        </Modal>
    );
});
