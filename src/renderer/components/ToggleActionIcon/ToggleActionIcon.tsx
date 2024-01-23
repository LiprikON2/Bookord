import React from "react";
import { ActionIcon, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Icon } from "@tabler/icons-react";

export const ToggleActionIcon = ({
    OnIcon,
    OffIcon,
    onAction,
    offAction,
    ariaLabel,
}: {
    OnIcon: Icon;
    OffIcon: Icon;
    onAction?: () => void;
    offAction?: () => void;
    ariaLabel?: string;
}) => {
    const [toggled, { toggle }] = useDisclosure(false);

    const handleToggle = () => {
        toggled ? offAction() : onAction();
        toggle();
    };

    const iconProps = { style: { width: "65%", height: "65%" }, stroke: 1.5 };

    return (
        <ActionIcon
            onClick={handleToggle}
            size={rem(36)}
            aria-label={ariaLabel}
            /* 
            variant={toggled ? "default-alt" : "default-subtle"}
            style={{ border: "none" }}
            /*/
            variant="default-subtle"
            //*/
        >
            {toggled ? <OnIcon {...iconProps} /> : <OffIcon {...iconProps} />}
        </ActionIcon>
    );
};
