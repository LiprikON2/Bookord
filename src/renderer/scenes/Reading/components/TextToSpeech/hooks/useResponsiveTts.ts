import { useToggle } from "@mantine/hooks";
import { runInAction } from "mobx";
import { useEffect } from "react";
import { useBookReadStore } from "~/renderer/stores";
import { useTtsUtils } from "./useTtsUtils";

export const useResponsiveTts = (
    selectedVoice: { name: VoiceType; lang: string },
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

    const stopTts = () => {
        responsiveVoice.cancel();
        toggleTtsStatus("standby");
        bookReadStore.resetTtsTarget();
    };

    const resumeTts = () => {
        responsiveVoice.resume();
        toggleTtsStatus("speaking");
    };

    const pauseTts = () => {
        responsiveVoice.pause();
        toggleTtsStatus("paused");
    };

    const startTts = (text: string, nextElem: Element, selection: Selection) => {
        const onEnd = nextElem
            ? () => {
                  selectElem(nextElem, selection);

                  let nextText = nextElem.textContent;

                  // TODO fix, not working for some reason
                  if (!nextElem.textContent) {
                      const img: HTMLImageElement = nextElem.querySelector("img[alt]");
                      if (img) nextText = img.alt;
                  }

                  startTts(nextText, nextElem.nextElementSibling, selection);
                  flipToElement(nextElem);
              }
            : () => {
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

        responsiveVoice.speak(text, selectedVoice.name, {
            rate: selectedRate,
            pitch: selectedPitch,
            onend: onEnd,
            onstart: () => {
                console.log("onSTart");
                toggleTtsStatus("speaking");
            },
        });
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
