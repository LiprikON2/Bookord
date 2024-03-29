import React, { type CSSProperties } from "react";
import { useState } from "react";
import { FloatingIndicator, Tabs, UnstyledButton } from "@mantine/core";

import classes from "./SegmentedTabList.module.css";
import { type SidebarMarkup } from "../../Sidebar";

interface SegmentedTabListProps {
    markup: SidebarMarkup;
    showText?: boolean;
    style?: CSSProperties;
}

// ref: https://mantine.dev/core/floating-indicator/
export const SegmentedTabList = ({ markup, showText = false, style }: SegmentedTabListProps) => {
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
    const [active, setActive] = useState(0);

    const setControlRef = (index: number) => (node: HTMLButtonElement) => {
        controlsRefs[index] = node;
        setControlsRefs(controlsRefs);
    };

    return (
        <Tabs.List className={classes.root} ref={setRootRef} style={style}>
            {markup.map((outerTab: any, index: number) => (
                <Tabs.Tab
                    key={outerTab.name}
                    value={outerTab.name}
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
                target={controlsRefs[active]}
                parent={rootRef}
                className={classes.indicator}
            />
        </Tabs.List>
    );
};
