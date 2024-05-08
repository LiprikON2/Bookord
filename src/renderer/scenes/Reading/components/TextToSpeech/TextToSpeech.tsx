import React, { useState } from "react";
import {
    ActionIcon,
    Box,
    Code,
    Combobox,
    Divider,
    Group,
    Highlight,
    Input,
    InputBase,
    Kbd,
    ScrollArea,
    Stack,
    Text,
    useCombobox,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { observer } from "mobx-react-lite";
import {
    IconPlayerPauseFilled,
    IconPlayerPlayFilled,
    IconPlayerStopFilled,
} from "@tabler/icons-react";

import { usePlatform } from "~/renderer/hooks";
import { useTts, useTtsVoices } from "./hooks";
import { SliderInput } from "./components";
import classes from "./TextToSpeech.module.css";

// TODO consider transforming TTS to AudioBuffer https://github.com/guest271314/SpeechSynthesisRecorder
export const TextToSpeech = observer(() => {
    const [pitch, setPitch] = useState<number>(1);
    const [rate, setRate] = useState<number>(1.5);

    const platform = usePlatform();

    const { selectedVoice, handleVoiceChange, voicesGroups } = useTtsVoices();
    const { ttsStatus, pauseTts, resumeTts, stopTts } = useTts(selectedVoice, pitch, rate);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    return (
        <>
            {isDev() && (
                <button
                    onClick={() => {
                        // responsiveVoice.speak("hello world");
                        // responsiveVoice.speak("hello world", "Fallback UK Female");
                        // responsiveVoice.speak("hello world", "Welsh Male");
                        responsiveVoice.speak("Привет мир", "Russian Female");
                    }}
                >
                    Test
                </button>
            )}
            <Stack pl="sm" pr="md">
                <Combobox
                    disabled={ttsStatus !== "standby"}
                    size="xs"
                    store={combobox}
                    withinPortal={false}
                    onOptionSubmit={(value) => {
                        handleVoiceChange(value);
                        combobox.closeDropdown();
                    }}
                >
                    <Combobox.Target>
                        <InputBase
                            disabled={ttsStatus !== "standby"}
                            size="sm"
                            component="button"
                            type="button"
                            className={classes.input}
                            pointer
                            rightSection={<Combobox.Chevron className={classes.chevron} />}
                            onClick={() => combobox.toggleDropdown()}
                            rightSectionPointerEvents="none"
                        >
                            {selectedVoice?.name || (
                                <Input.Placeholder>Select voice</Input.Placeholder>
                            )}
                        </InputBase>
                    </Combobox.Target>

                    <Combobox.Dropdown>
                        <Combobox.Options>
                            <ScrollArea.Autosize
                                mah={400}
                                type="auto"
                                offsetScrollbars
                                scrollbarSize={4}
                            >
                                {voicesGroups.map(
                                    ([groupName, voices]: [string, SpeechSynthesisVoice[]]) => (
                                        <Combobox.Group
                                            key={groupName}
                                            label={groupName}
                                            className={classes.group}
                                        >
                                            {voices.map((voice) => (
                                                <Combobox.Option
                                                    key={voice.name}
                                                    className={classes.option}
                                                    value={voice.name}
                                                    data-active={voice.name === selectedVoice?.name}
                                                >
                                                    {voice.name}
                                                </Combobox.Option>
                                            ))}
                                        </Combobox.Group>
                                    )
                                )}
                                {voicesGroups.length === 0 && (
                                    <Combobox.Empty>
                                        <Text inherit>No voices found.</Text>
                                        {platform === "linux" && <LinuxNoVoices />}
                                    </Combobox.Empty>
                                )}
                            </ScrollArea.Autosize>
                        </Combobox.Options>
                    </Combobox.Dropdown>
                </Combobox>
                <SliderInput
                    disabled={ttsStatus !== "standby"}
                    label="Pitch"
                    value={pitch}
                    onChange={setPitch}
                />
                <SliderInput
                    disabled={ttsStatus !== "standby"}
                    label="Rate"
                    value={rate}
                    onChange={setRate}
                />

                <Group>
                    {ttsStatus !== "standby" && (
                        <>
                            <ActionIcon
                                onClick={ttsStatus === "speaking" ? pauseTts : resumeTts}
                                variant="outline"
                                aria-label={ttsStatus === "speaking" ? "Pause" : "Resume"}
                            >
                                {ttsStatus === "speaking" && (
                                    <IconPlayerPauseFilled
                                        style={{ width: "70%", height: "70%" }}
                                        stroke={1.5}
                                    />
                                )}
                                {ttsStatus === "paused" && (
                                    <IconPlayerPlayFilled
                                        style={{ width: "70%", height: "70%" }}
                                        stroke={1.5}
                                    />
                                )}
                            </ActionIcon>
                            <ActionIcon variant="outline" onClick={stopTts} aria-label="Stop">
                                <IconPlayerStopFilled
                                    style={{ width: "70%", height: "70%" }}
                                    stroke={1.5}
                                />
                            </ActionIcon>
                        </>
                    )}
                    {ttsStatus === "standby" && (
                        <Box mb="sm">
                            <Text size="sm" c="dimmed">
                                Select text, right-click to open menu, then choose{" "}
                                <Kbd>Text-to-Speech</Kbd> to start.
                            </Text>
                        </Box>
                    )}
                </Group>
            </Stack>
        </>
    );
});

const LinuxNoVoices = observer(() => {
    const clipboard = useClipboard({ timeout: 500 });

    const installCommand = "sudo apt install espeak speech-dispatcher";

    return (
        <Text fz={10}>
            <Divider my="xs" />
            <Text ta="start" inherit>
                Do you have <Code fz={10}>espeak</Code> and <Code fz={10}>speech-dispatcher</Code>{" "}
                installed?
            </Text>
            <Text mt={4} ta="start" inherit>
                Try running: <br />
                <Code
                    fz={10}
                    onClick={() => clipboard.copy(installCommand)}
                    style={{ cursor: "pointer" }}
                >
                    <Highlight
                        component="span"
                        inherit
                        highlight={clipboard.copied ? installCommand : ""}
                    >
                        {installCommand}
                    </Highlight>
                </Code>{" "}
                and reopeing the app.
            </Text>
        </Text>
    );
});
