import React from "react";
import { Progress, ProgressProps } from "@mantine/core";
import { observer } from "mobx-react-lite";

interface ProgressObserverProps extends Omit<ProgressProps, "value"> {
    getValue: () => number | number;
}

export const ProgressObserver = observer(({ getValue, title, ...rest }: ProgressObserverProps) => {
    const progress = getValue();
    if (progress === null) return <></>;

    return <Progress value={progress} title={`${title} progress ${progress}%`} {...rest} />;
});
