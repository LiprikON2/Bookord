import React, { useEffect, useState } from "react";
import {
    Box,
    Combobox,
    Input,
    InputBase,
    ScrollArea,
    Select,
    Text,
    useCombobox,
} from "@mantine/core";

import classes from "./TextToSpeech.module.css";

interface TextToSpeechProps {}

export const TextToSpeech = ({}: TextToSpeechProps) => {
    const voices = speechSynthesis.getVoices();
    const voicesGroups = Object.entries(Object.groupBy(voices, ({ lang }) => lang));

    const defaultVoice = voices[0];

    const [selectedVoice, setSelectedVoice] = useState(defaultVoice);
    useEffect(() => {
        if (defaultVoice && !selectedVoice) setSelectedVoice(defaultVoice);
    }, [defaultVoice]);

    const handleVoiceChange = (voiceName: string) => {
        const voice = voices.find((voice) => voice.name === voiceName);
        setSelectedVoice(voice);
        combobox.closeDropdown();
    };

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    return (
        <>
            <Text c="dimmed" size="sm" px="sm" mb="xs">
                Text-to-Speech
            </Text>
            <Box pl="sm">
                <Combobox
                    size="xs"
                    store={combobox}
                    withinPortal={false}
                    onOptionSubmit={handleVoiceChange}
                >
                    <Combobox.Target>
                        <InputBase
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
                                    <Combobox.Empty>No voices found</Combobox.Empty>
                                )}
                            </ScrollArea.Autosize>
                        </Combobox.Options>
                    </Combobox.Dropdown>
                </Combobox>
            </Box>
        </>
    );
};
