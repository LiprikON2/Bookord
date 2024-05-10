import { useEffect, useState } from "react";

export interface ResponsiveVoice {
    name: VoiceType;
    lang: string;
}

export const useResponsiveVoices = () => {
    const voices = responsiveVoice.getVoices();

    const defaultVoice: ResponsiveVoice = voices?.[0] && { name: voices[0].name, lang: "All" };
    const [selectedVoice, setSelectedVoice] = useState(defaultVoice);

    useEffect(() => {
        if (defaultVoice && !selectedVoice) setSelectedVoice(defaultVoice);
    }, [defaultVoice]);

    const handleVoiceChange = (voiceName: VoiceType) => {
        setSelectedVoice({ name: voiceName, lang: "All" });
    };

    const voiceGroups = [["All", voices.map(({ name }) => ({ name, lang: "All" }))]];

    return { handleVoiceChange, voiceGroups, selectedVoice };
};
