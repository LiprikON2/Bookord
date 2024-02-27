import React, { forwardRef, useEffect } from "react";
import { ActionIcon, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Icon } from "@tabler/icons-react";

type ToggleActionIconProps = {
    OnIcon: Icon;
    OffIcon: Icon;
    on?: boolean;
    onClick?: () => void;
    onAction?: () => void;
    offAction?: () => void;
    ariaLabel?: string;
    classNames?: {
        icon?: string;
    };
};

export const ToggleActionIcon = forwardRef<HTMLButtonElement, ToggleActionIconProps>(
    (
        {
            OnIcon,
            OffIcon,
            on,
            onClick,
            onAction,
            offAction,
            ariaLabel,
            classNames,
        }: ToggleActionIconProps,
        ref
    ) => {
        const [toggled, { toggle, open, close }] = useDisclosure(on ?? false);

        const handleActionIconToggle = () => {
            if (offAction && toggled) offAction();
            if (onAction && !toggled) onAction();
            toggle();
        };

        useEffect(() => {
            if (on === undefined) return;

            if (on) open();
            else close();
        }, [on]);

        const iconProps = {
            className: classNames?.icon,
            style: { width: "65%", height: "65%" },
            stroke: 1.5,
        };

        return (
            <ActionIcon
                ref={ref}
                onClick={onClick ? onClick : handleActionIconToggle}
                size={rem(36)}
                aria-label={ariaLabel}
                variant="default-subtle"
            >
                {toggled ? <OnIcon {...iconProps} /> : <OffIcon {...iconProps} />}
            </ActionIcon>
        );
    }
);
