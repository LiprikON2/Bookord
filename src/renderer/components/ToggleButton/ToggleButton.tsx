import React, { forwardRef, useEffect } from "react";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

type ToggleButtonProps = {
    onClick?: (on: boolean) => void;
    onAction?: () => void;
    offAction?: () => void;
    on?: boolean;
    variants?: {
        on: string;
        off: string;
    };
};

const defaultVariants = {
    on: "default-alt-2",
    off: "default-subtle",
};

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(
    (
        {
            onClick,
            onAction,
            offAction,
            on,
            variants = defaultVariants,
            ...rest
        }: ToggleButtonProps,
        ref
    ) => {
        const [toggled, { toggle, open, close }] = useDisclosure(on ?? false);

        const handleToggle = () => {
            if (offAction && toggled) offAction();
            if (onAction && !toggled) onAction();
            toggle();
        };

        useEffect(() => {
            if (on === undefined) return;

            if (on) open();
            else close();
        }, [on]);

        return (
            <Button
                styles={{ inner: { maxWidth: "100%" } }}
                ref={ref}
                onClick={() => {
                    onClick(!toggled);
                    handleToggle();
                }}
                variant={toggled ? variants.on : variants.off}
                {...rest}
            />
        );
    }
);
