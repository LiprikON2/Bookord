import React from "react";
import { Text, TextProps } from "@mantine/core";
import { observer } from "mobx-react-lite";

interface TextObserverProps extends Omit<TextProps, "children"> {
    children: () => React.ReactNode;
}

export const TextObserver = observer(({ children, ...rest }: TextObserverProps) => {
    return <Text {...rest}>{children()}</Text>;
});
