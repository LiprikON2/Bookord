import { useToggle } from "@mantine/hooks";
import { action, reaction, runInAction, when } from "mobx";
import { useEffect } from "react";
import { useBookReadStore } from "~/renderer/stores";

const getParentElement = (ancestorElem: HTMLElement, childElem: ParentNode) => {
    let parentElem = childElem;

    while (parentElem.parentNode !== ancestorElem) {
        parentElem = parentElem.parentNode;
    }

    return parentElem;
};

const selectElem = (elem: Element, selection: Selection) => {
    const range = document.createRange();
    range.selectNodeContents(elem);

    selection.removeAllRanges();
    selection.addRange(range);
};

// TODO use selection.modify("extend", "forward", "sentenceboundary") instead of the whole paragraphs
// https://developer.mozilla.org/en-US/docs/Web/API/Selection/modify#granularity
export const useTts = (
    selectedVoice: SpeechSynthesisVoice,
    selectedPitch = 1,
    selectedRate = 1
) => {
    const [ttsStatus, toggleTtsStatus] = useToggle(["standby", "speaking", "paused"]);
    const bookReadStore = useBookReadStore();

    const flipToElement = action((nextElem: Element) => {
        bookReadStore.bookComponent?.shiftToElement?.({ element: nextElem as HTMLElement });
    });

    const ttsNextSection = action(() => {
        bookReadStore.bookComponent?.flipNSections?.(1);

        const elem = bookReadStore.bookComponent?.contentChildren[0];
        // @ts-ignore
        const selection: Selection = bookReadStore.bookComponent.shadowRoot.getSelection();
        selectElem(elem, selection);
        startTts(elem.textContent, elem.nextElementSibling, selection);
    });

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
                    ttsNextSection();
                }
            };
        }

        speechSynthesis.speak(utterance);

        updateTtsState();
    };

    useEffect(() => {
        runInAction(() => {
            if (!bookReadStore.ttsTarget.startElement) return;

            const { startElement, startElementSelectedText } = bookReadStore.ttsTarget;

            const startParentElem = getParentElement(
                bookReadStore.bookComponent.contentElem,
                startElement
            ) as HTMLElement;
            const startElementText = startParentElem.textContent;

            /** Transforms selected text
             *       <p>Test 123 456</p>
             * from          |||
             *   to          |||||||
             */
            const initText = [
                startElementSelectedText,
                ...startElementText.split(startElementSelectedText).slice(1),
            ].join("");
            const nextParentElem = startParentElem.nextElementSibling;
            // @ts-ignore
            const selection: Selection = bookReadStore.bookComponent.shadowRoot.getSelection();
            selection.modify("extend", "forward", "paragraphboundary");

            stopTts();
            startTts(initText, nextParentElem, selection);
        });
    }, [bookReadStore.ttsTarget.startElement]);

    return { ttsStatus, startTts, pauseTts, resumeTts, stopTts };
};
