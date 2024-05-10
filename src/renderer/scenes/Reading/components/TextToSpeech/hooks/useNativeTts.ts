import { useToggle } from "@mantine/hooks";
import { runInAction } from "mobx";
import { useEffect } from "react";
import { useBookReadStore } from "~/renderer/stores";
import { useTtsUtils } from "./useTtsUtils";

// TODO use selection.modify("extend", "forward", "sentenceboundary") instead of the whole paragraphs
// https://developer.mozilla.org/en-US/docs/Web/API/Selection/modify#granularity
export const useNativeTts = (
    selectedVoice: SpeechSynthesisVoice,
    active = true,
    selectedPitch = 1,
    selectedRate = 1
) => {
    const [ttsStatus, toggleTtsStatus] = useToggle<"standby" | "speaking" | "paused">([
        "standby",
        "speaking",
        "paused",
    ]);
    const bookReadStore = useBookReadStore();

    const { flipToElement, selectElem, initTts, continuteTtsNextSection } = useTtsUtils();

    const updateTtsState = () => {
        if (speechSynthesis.paused) {
            toggleTtsStatus("paused");
        }
        if (speechSynthesis.speaking && !speechSynthesis.paused) {
            toggleTtsStatus("speaking");
        }
        if (!speechSynthesis.speaking && !speechSynthesis.paused) {
            toggleTtsStatus("standby");
        }
    };

    const stopTts = () => {
        speechSynthesis.cancel();
        speechSynthesis.speak(new SpeechSynthesisUtterance(""));
        speechSynthesis.cancel();
        updateTtsState();
        bookReadStore.resetTtsTarget();
    };

    const resumeTts = () => {
        speechSynthesis.resume();
        // Set manually, since state speaking is not reflected immediately by speechSynthesis.speaking
        toggleTtsStatus("speaking");
    };

    const pauseTts = () => {
        speechSynthesis.pause();
        // Set manually, since state pause is not reflected immediately by speechSynthesis.paused
        toggleTtsStatus("paused");
    };

    // TODO paragraphTts = (sentences: string[], nextElem: Element, selection: Selection)
    //      <...>
    //      paragraphTts(sentences.pop(), ...)
    const startTts = (text: string, nextElem: Element, selection: Selection) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = selectedPitch;
        utterance.rate = selectedRate;
        utterance.voice = selectedVoice;

        if (nextElem) {
            utterance.onend = () => {
                selectElem(nextElem, selection);

                let nextText = nextElem.textContent;

                // TODO fix, not working for some reason
                if (!nextElem.textContent) {
                    const img: HTMLImageElement = nextElem.querySelector("img[alt]");
                    if (img) nextText = img.alt;
                }

                startTts(nextText, nextElem.nextElementSibling, selection);
                flipToElement(nextElem);
            };
        } else {
            utterance.onend = () => {
                selection.removeAllRanges();
                stopTts();
                if (bookReadStore.bookComponent?.doesNextSectionExist) {
                    continuteTtsNextSection((nextSectionElem, nextSelection) => {
                        startTts(
                            nextSectionElem.textContent,
                            nextSectionElem.nextElementSibling,
                            nextSelection
                        );
                    });
                }
            };
        }

        speechSynthesis.speak(utterance);

        updateTtsState();
    };

    useEffect(() => {
        runInAction(() => {
            if (!active || !bookReadStore.ttsTarget.startElement) return;
            const { startElement, startElementSelectedText } = bookReadStore.ttsTarget;
            const { initText, nextParentElem, selection } = initTts(
                startElement,
                startElementSelectedText
            );

            stopTts();
            startTts(initText, nextParentElem, selection);
        });
    }, [active, bookReadStore.ttsTarget.startElement]);

    return { ttsStatus, startTts, pauseTts, resumeTts, stopTts };
};
