/* eslint-disable react/display-name */
import React, { forwardRef, useEffect } from "react";
import { ActionIcon, rem, ActionIconProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type Icon } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

interface ToggleActionIconProps extends ActionIconProps {
    OnIcon: Icon;
    OffIcon: Icon;
    on?: boolean;
    onClick?: () => void;
    onAction?: () => void;
    offAction?: () => void;
    ariaLabel?: string;
    getAriaLabel?: () => string;
    iconSize?: string;

    classNames?: {
        icon?: string;
    };
}

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
                variant,
                iconSize = "65%",
                ...rest
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
                style: { width: iconSize, height: iconSize },
                stroke: 1.5,
            };

            return (
                <ActionIcon
                    ref={ref}
                    onClick={onClick ? onClick : handleActionIconToggle}
                    size={rem(36)}
                    aria-label={getAriaLabel?.() ?? ariaLabel}
                    variant={variant ?? "default-subtle"}
                    {...rest}
                >
                    {toggled ? <OnIcon {...iconProps} /> : <OffIcon {...iconProps} />}
                </ActionIcon>
            );
        }
    )
);
ToggleActionIcon.displayName = "ToggleActionIcon";
export { ToggleActionIcon };
