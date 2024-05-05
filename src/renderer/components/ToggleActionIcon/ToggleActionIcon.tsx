/* eslint-disable react/display-name */
import React, { forwardRef, useEffect } from "react";
import { ActionIcon, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Icon } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

type ToggleActionIconProps = {
    OnIcon: Icon;
    OffIcon: Icon;
    on?: boolean;
    onClick?: () => void;
    onAction?: () => void;
    offAction?: () => void;
    ariaLabel?: string;
    getAriaLabel?: () => string;
    classNames?: {
        icon?: string;
    };
};

const ToggleActionIcon = observer(
    forwardRef(
        (
            {
                OnIcon,
                OffIcon,
                on,
                onClick,
                onAction,
                offAction,
                getAriaLabel,
                classNames,
                ariaLabel,
            }: ToggleActionIconProps,
            ref: React.ForwardedRef<HTMLButtonElement>
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
                    aria-label={getAriaLabel?.() ?? ariaLabel}
                    variant="default-subtle"
                >
                    {toggled ? <OnIcon {...iconProps} /> : <OffIcon {...iconProps} />}
                </ActionIcon>
            );
        }
    )
);
ToggleActionIcon.displayName = "ToggleActionIcon";
export { ToggleActionIcon };
