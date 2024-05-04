import React from "react";
import { Title, TitleProps } from "@mantine/core";
import { observer } from "mobx-react-lite";

interface TitleObserverProps extends Omit<TitleProps, "children"> {
    children: () => React.ReactNode;
}

export const TitleObserver = observer(({ children, ...rest }: TitleObserverProps) => {
    return <Title {...rest}>{children()}</Title>;
});
