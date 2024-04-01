import React from "react";
import clsx from "clsx";

import context from "./ipc";
import { ControlButton } from "./components";
import classes from "./WindowControls.module.css";

type Props = {
    platform: string;
    tooltips?: boolean;
};

const closePath =
    "M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z";
const maximizePath = "M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z";
const minimizePath = "M 0,5 10,5 10,6 0,6 Z";

export const WindowControls = (props: Props) => {
    return (
        <section className={classes.windowTitlebarControls}>
            <ControlButton
                className={clsx(
                    classes[`${props.platform}OsControl`],
                    classes[`${props.platform}OsControlMinimize`]
                )}
                name="minimize"
                onClick={() => context.minimize()}
                path={minimizePath}
                title={props.tooltips ? "Minimize" : null}
            />
            <ControlButton
                className={clsx(
                    classes[`${props.platform}OsControl`],
                    classes[`${props.platform}OsControlMaximize`]
                )}
                name="maximize"
                onClick={() => context.toggleMaximize()}
                path={maximizePath}
                title={props.tooltips ? "Maximize" : null}
            />
            <ControlButton
                className={clsx(
                    classes[`${props.platform}OsControl`],
                    classes[`${props.platform}OsControlClose`]
                )}
                name="close"
                onClick={() => context.exit()}
                path={closePath}
                title={props.tooltips ? "Close" : null}
            />
        </section>
    );
};
