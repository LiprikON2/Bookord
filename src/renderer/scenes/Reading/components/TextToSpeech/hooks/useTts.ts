import { useToggle } from "@mantine/hooks";
import { useNativeTts } from "./useNativeTts";
import { useNativeVoices } from "./useNativeVoices";
import { useResponsiveVoices } from "./useResponsiveVoices";
import { useResponsiveTts } from "./useResponsiveTts";
import { useEffect } from "react";

export interface GenericVoice {
    name: string;
    lang: string;
}
const defaultTtsApis = ["system", "responsive"] as const;
export type TtsApisTypes = (typeof defaultTtsApis)[number];

export const useTts = (pitch = 1, rate = 1) => {
    const [ttsApi, toggleTtsApi] = useToggle<TtsApisTypes>(defaultTtsApis);
    const ttsApis: TtsApisTypes[] = [...defaultTtsApis];

    const nativeVoices = useNativeVoices();
    const nativeTts = useNativeTts(nativeVoices.selectedVoice, ttsApi === "system", pitch, rate);

    const responsiveVoices = useResponsiveVoices();
    const responsiveTts = useResponsiveTts(
        responsiveVoices.selectedVoice,
        ttsApi === "responsive",
        pitch,
        rate
    );

    const getSelectedVoice = () => {
        if (ttsApi === "system") return nativeVoices.selectedVoice;
        if (ttsApi === "responsive") return responsiveVoices.selectedVoice;
    };
    const getHandleVoiceChange = () => {
        if (ttsApi === "system") return nativeVoices.handleVoiceChange;
        if (ttsApi === "responsive") return responsiveVoices.handleVoiceChange;
    };
    const getVoiceGroups = () => {
        if (ttsApi === "system") return nativeVoices.voiceGroups;
        if (ttsApi === "responsive") return responsiveVoices.voiceGroups;
    };

    const getTtsStatus = () => {
        if (ttsApi === "system") return nativeTts.ttsStatus;
        if (ttsApi === "responsive") return responsiveTts.ttsStatus;
    };
    const getPauseTts = () => {
        if (ttsApi === "system") return nativeTts.pauseTts;
        if (ttsApi === "responsive") return responsiveTts.pauseTts;
    };
    const getResumeTts = () => {
        if (ttsApi === "system") return nativeTts.resumeTts;
        if (ttsApi === "responsive") return responsiveTts.resumeTts;
    };
    const getStopTts = () => {
        if (ttsApi === "system") return nativeTts.stopTts;
        if (ttsApi === "responsive") return responsiveTts.stopTts;
    };

    const selectedVoice = getSelectedVoice();
    const handleVoiceChange = getHandleVoiceChange();
    const voiceGroups = getVoiceGroups() as [string, GenericVoice[]][];

    const ttsStatus = getTtsStatus();
    const pauseTts = getPauseTts();
    const resumeTts = getResumeTts();
    const stopTts = getStopTts();

    return {
        ttsApi,
        toggleTtsApi,
        ttsApis,
        handleVoiceChange,
        selectedVoice,
        voiceGroups,
        //
        ttsStatus,
        pauseTts,
        resumeTts,
        stopTts,
    };
};
