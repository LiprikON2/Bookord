import React, { useEffect, useRef } from "react";
import { Overlay, Portal } from "@mantine/core";
import { observer } from "mobx-react-lite";
import { Tooltip, TooltipRefProps } from "react-tooltip";

import classes from "./HighlightContextMenuTooltip.module.css";
import { TooltipTarget } from "../TranslationTooltip";
import { useColorScheme } from "~/renderer/hooks";
import { useBookReadStore } from "~/renderer/stores";

export interface HighlightContextMenuTooltipTarget {
    instanceAttrs: { [attr: string]: string };
    position: { x: number; y: number };
}

interface HighlightContextMenuTooltipProps {
    target: HighlightContextMenuTooltipTarget;
    opened: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const HighlightContextMenuTooltip = observer(
    ({ target, opened, onOpen, onClose }: HighlightContextMenuTooltipProps) => {
        const highlightContextMenuRef = useRef<TooltipRefProps>(null);

        useEffect(() => {
            if (target.position !== null) onOpen();
        }, [target.position]);

        useEffect(() => {
            if (opened)
                highlightContextMenuRef.current?.open({
                    // content: JSON.stringify(target.position),
                    position: target.position,
                });
            else highlightContextMenuRef.current?.close();
        }, [opened]);

        const { colorSceme } = useColorScheme();
        const bookReadStore = useBookReadStore();

        return (
            <Portal>
                <Tooltip
                    id="translation"
                    className={classes.tooltip}
                    ref={highlightContextMenuRef}
                    imperativeModeOnly
                    variant={colorSceme}
                    opacity={1}
                    clickable
                >
                    <button
                        onClick={() => {
                            console.log("click");
                            bookReadStore.unhighlight(target.instanceAttrs);
                        }}
                    >
                        He he
                    </button>
                </Tooltip>
                {opened && <Overlay onClick={onClose} zIndex={10} opacity={0} />}
            </Portal>
        );
    }
);
