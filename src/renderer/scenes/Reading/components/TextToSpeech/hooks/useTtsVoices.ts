import { useState, useEffect } from "react";

export const useTtsVoices = () => {
    const voices = speechSynthesis.getVoices();
    const voicesGroups = Object.entries(Object.groupBy(voices, ({ lang }) => lang)).sort(
        ([voiceGroupA], [voiceGroupB]) => voiceGroupA.localeCompare(voiceGroupB)
    );

    const defaultVoice = voicesGroups?.[0]?.[1]?.[0];

    const [selectedVoice, setSelectedVoice] = useState(defaultVoice);
    useEffect(() => {
        if (defaultVoice && !selectedVoice) setSelectedVoice(defaultVoice);
    }, [defaultVoice]);

    const handleVoiceChange = (voiceName: string) => {
        const voice = voices.find((voice) => voice.name === voiceName);
        setSelectedVoice(voice);
    };

    return { handleVoiceChange, voicesGroups, selectedVoice };
};
