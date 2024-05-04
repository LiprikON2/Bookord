import React, { type CSSProperties, useEffect } from "react";
import { useState } from "react";
import { randomId, useViewportSize } from "@mantine/hooks";
import { FloatingIndicator, Tabs, UnstyledButton } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { type SidebarMarkup } from "../../Sidebar";
import classes from "./SegmentedTabList.module.css";

interface SegmentedTabListProps {
    markup: SidebarMarkup;
    showText?: boolean;
    style?: CSSProperties;
}

// ref: https://mantine.dev/core/floating-indicator/
export const SegmentedTabList = observer(
    ({ markup, showText = false, style }: SegmentedTabListProps) => {
        const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
        const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>(
            {}
        );
        const [active, setActive] = useState(0);

        const setControlRef = (index: number) => (node: HTMLButtonElement) => {
            controlsRefs[index] = node;
            setControlsRefs(controlsRefs);
        };

        const { height, width } = useViewportSize();

        // ref(bug): https://github.com/mantinedev/mantine/issues/6116#issuecomment-2071796202
        const [key, setKey] = useState(randomId());
        useEffect(() => {
            setKey(randomId());
        }, [height, width]);

        return (
            <Tabs.List className={classes.root} ref={setRootRef} style={style}>
                {markup.map((outerTab, index) => (
                    <Tabs.Tab
                        key={outerTab.name}
                        value={outerTab.name}
                        title={outerTab.name}
                        leftSection={<outerTab.Icon className={classes.icon} />}
                        component={UnstyledButton}
                        className={classes.control}
                        ref={setControlRef(index)}
                        onClick={() => setActive(index)}
                        mod={{ active: active === index }}
                    >
                        {showText && <span className={classes.controlLabel}>{outerTab.name}</span>}
                    </Tabs.Tab>
                ))}
                <FloatingIndicator
                    key={key}
                    target={controlsRefs[active]}
                    parent={rootRef}
                    className={classes.indicator}
                />
            </Tabs.List>
        );
    }
);
