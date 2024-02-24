import React, { forwardRef, useEffect } from "react";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type ToggleButtonProps = {
    on?: boolean;
    onClick?: (on: boolean) => void;
    onAction?: () => void;
    offAction?: () => void;
};

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
    ({ onClick, onAction, offAction, ...rest }: ToggleButtonProps, ref) => {
        const [toggled, { toggle }] = useDisclosure(false);

        const handleToggle = () => {
            if (offAction && toggled) offAction();
            if (onAction && !toggled) onAction();
            toggle();
        };

        return (
            <Button
                styles={{ inner: { maxWidth: "100%" } }}
                ref={ref}
                onClick={() => {
                    handleToggle();
                    onClick(toggled);
                }}
                variant={toggled ? "default-alt" : "default-subtle"}
                {...rest}
            />
        );
    }
);
