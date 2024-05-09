import React from "react";
import { UnstyledButton } from "@mantine/core";
import { observer } from "mobx-react-lite";
import clsx from "clsx";

import classes from "./FlipPageButton.module.css";
import { IconChevronCompactLeft, IconChevronCompactRight } from "@tabler/icons-react";

interface FlipPageButtonProps {
    direction?: "left" | "right";
    className?: string;
    onClick?: () => void;
    strength?: "low" | "medium" | "high";
    onLowClick?: () => void;
    onMediumClick?: () => void;
    onHighClick?: () => void;
}

export const FlipPageButton = observer(
    ({
        className,
        direction = "left",
        strength = "low",
        onClick,
        onLowClick,
        onMediumClick,
        onHighClick,
    }: FlipPageButtonProps) => {
        const IconChevron =
            direction === "right" ? IconChevronCompactRight : IconChevronCompactLeft;

        if (!onLowClick) onLowClick = onClick;
        if (!onMediumClick) onMediumClick = onClick;
        if (!onHighClick) onHighClick = onClick;

        const getOnClick = () => {
            if (strength === "low") return onLowClick;
            if (strength === "medium") return onMediumClick;
            if (strength === "high") return onHighClick;
        };

        return (
            <UnstyledButton
                aria-hidden="true"
                tabIndex={-1}
                data-direction={direction}
                data-stength={strength}
                onClick={getOnClick()}
                className={clsx(classes.button, className)}
            >
                {strength === "low" ? (
                    <IconChevron className={classes.icon} stroke={1.5} />
                ) : strength === "medium" ? (
                    <>
                        <IconChevron data-position="left" className={classes.icon} stroke={1.25} />
                        <IconChevron className={classes.icon} stroke={1.25} />
                    </>
                ) : (
                    strength === "high" && (
                        <>
                            <IconChevron data-position="left" className={classes.icon} stroke={1} />
                            <IconChevron className={classes.icon} stroke={1} />
                            <IconChevron
                                data-position="right"
                                className={classes.icon}
                                stroke={1}
                            />
                        </>
                    )
                )}
            </UnstyledButton>
        );
    }
);
