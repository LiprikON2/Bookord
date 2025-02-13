import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipRefProps } from "react-tooltip";

import context from "~/renderer/ipc/thirdPartyApi";

import classes from "./TranslationTooltip.module.css";
import { Overlay, Portal } from "@mantine/core";
import { useColorScheme } from "~/renderer/hooks";
import { useSettingsStore } from "~/renderer/stores";

export interface TooltipTarget {
    text: string | null;
    position: { x: number; y: number } | null;
}

interface TranslationTooltipProps {
    target: TooltipTarget;
    opened: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const TranslationTooltip = observer(
    ({ target, opened, onOpen, onClose }: TranslationTooltipProps) => {
        // TODO make a setting https://developers.deepl.com/docs/resources/supported-languages#target-languages
        const translateTargetLang = "RU";

        const { getSetting } = useSettingsStore();

        const { data: translation, error } = useQuery({
            queryKey: ["deepl", target.text, translateTargetLang] as [string, string, string],
            queryFn: ({ queryKey: [_, text, targetLang] }) => {
                const deeplKey = getSetting(["General", "API", "Language", "DeepL API key"]).value;
                return context.apiDeepl(text, targetLang, deeplKey);
            },
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
            enabled: target.text !== null,
        });

        useEffect(() => {
            if (translation) onOpen();
        }, [translation]);

        const translationTooltipRef = useRef<TooltipRefProps>(null);

        useEffect(() => {
            if (opened)
                translationTooltipRef.current?.open({
                    content: translation,
                    position: target.position,
                });
            else translationTooltipRef.current?.close();
        }, [opened]);

        const { colorSceme } = useColorScheme();

        return (
            <Portal>
                <Tooltip
                    id="translation"
                    className={classes.tooltip}
                    ref={translationTooltipRef}
                    imperativeModeOnly
                    variant={colorSceme}
                    opacity={1}
                    clickable
                />
                {opened && <Overlay onClick={onClose} zIndex={10} opacity={0} />}
            </Portal>
        );
    }
);
