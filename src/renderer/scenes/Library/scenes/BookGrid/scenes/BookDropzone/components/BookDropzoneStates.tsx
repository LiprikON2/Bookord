import React from "react";
import { Group, rem, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconBook2, IconBookUpload, IconX } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

interface BookDropzoneStatesProps {
    fullscreen?: boolean;
}
export const BookDropzoneStates = observer(({ fullscreen = false }: BookDropzoneStatesProps) => {
    return (
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
            <Dropzone.Accept>
                <IconBookUpload
                    style={{
                        width: rem(52),
                        height: rem(52),
                        color: "var(--mantine-color-primary-filled)",
                    }}
                    stroke={1.5}
                />
            </Dropzone.Accept>
            <Dropzone.Reject>
                <IconX
                    style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }}
                    stroke={1.5}
                />
            </Dropzone.Reject>
            <Dropzone.Idle>
                <IconBook2
                    style={{
                        width: rem(52),
                        height: rem(52),
                        color: "var(--mantine-color-dimmed)",
                    }}
                    stroke={1.5}
                />
            </Dropzone.Idle>

            <div>
                <Text size="xl" inline>
                    {fullscreen ? "Drag books here" : "Drag books here or click to select files"}
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                    Attach as many files as you like
                </Text>
            </div>
        </Group>
    );
});
