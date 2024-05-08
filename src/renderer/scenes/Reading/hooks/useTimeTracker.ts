import { useLayoutEffect } from "react";
import { useIdleTimer } from "react-idle-timer";

export const useTimeTracker = (onTimeLog: (activeTime: number, idleTime: number) => void) => {
    const idleTimer = useIdleTimer({
        timeout: 600000 /* 10 mins */,
        startOnMount: false,
    });

    /* When using useEffect, it doesn't update mobx store with the last onTimeLog action (just before unmounting)*/
    useLayoutEffect(() => {
        return () => {
            const active = idleTimer.getActiveTime();
            const idle = idleTimer.getIdleTime();

            onTimeLog(active, idle);

            idleTimer.reset();
        };
    });
};
