import { NumberInput, Slider } from "@mantine/core";

import classes from "./SliderInput.module.css";
import React from "react";

interface SliderInputProps {
    value: number;
    onChange: (value: number) => void;
    disabled: boolean;
    label?: string;
    min?: number;
    max?: number;
}

export const SliderInput = ({
    value,
    onChange,
    disabled,
    label = "",
    min = 0.5,
    max = 3,
}: SliderInputProps) => {
    return (
        <div className={classes.wrapper}>
            <NumberInput
                disabled={disabled}
                value={value}
                onChange={onChange}
                label={label}
                placeholder={label}
                step={0.1}
                min={0}
                hideControls
                classNames={{ input: classes.input, label: classes.label }}
            />
            <Slider
                disabled={disabled}
                max={max}
                step={0.1}
                min={min}
                label={null}
                value={typeof value === "string" ? 0 : value}
                onChange={onChange}
                size={2}
                className={classes.slider}
                classNames={classes}
            />
        </div>
    );
};
