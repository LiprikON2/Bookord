import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipRefProps } from "react-tooltip";
import { Overlay, Portal } from "@mantine/core";

import { useColorScheme } from "~/renderer/hooks";
import context from "~/renderer/ipc/thirdPartyApi";
import classes from "./DictionaryTooltip.module.css";

interface TooltipTarget {
    text: string | null;
    position: { x: number; y: number } | null;
}

interface DictionaryTooltipProps {
    target: TooltipTarget;
    opened: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const DictionaryTooltip = observer(
    ({ target, opened, onOpen, onClose }: DictionaryTooltipProps) => {
        // TODO detect from text or book metadata
        const definitionTargetLang = "EN";
        const { data: definition } = useQuery({
            queryKey: ["dictionary", target.text, definitionTargetLang] as [string, string, string],
            queryFn: ({ queryKey: [_, text, targetLang] }) =>
                context.apiDictionary(text, targetLang),
            // select: (data: any) => data?.meanings?.[0]?.definitions?.[0]?.definition,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
            enabled: target.text !== null,
        });

        useEffect(() => {
            if (definition) onOpen();
        }, [definition]);

        const definitionTooltipRef = useRef<TooltipRefProps>(null);

        useEffect(() => {
            if (opened)
                definitionTooltipRef.current?.open({
                    content: definition,
                    position: target.position,
                });
            else definitionTooltipRef.current?.close();
        }, [opened]);

        const { colorScheme } = useColorScheme();

        return (
            <Portal>
                <Tooltip
                    id="dictionary"
                    className={classes.tooltip}
                    ref={definitionTooltipRef}
                    imperativeModeOnly
                    variant={colorScheme}
                    opacity={1}
                    clickable
                />
                {opened && <Overlay onClick={onClose} zIndex={10} opacity={0} />}
            </Portal>
        );
    }
);
