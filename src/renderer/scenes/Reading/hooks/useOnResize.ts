import { useDebouncedValue, useElementSize, useShallowEffect } from "@mantine/hooks";
import { useEffect } from "react";

// TODO fix infinite loop
export const useOnResize = (onResize: () => void, enabled: boolean = true) => {
    const { ref, width, height } = useElementSize();

    const [debouncedSize] = useDebouncedValue({ width, height }, 200);

    useShallowEffect(() => {
        if (ref.current && enabled) onResize();
    }, [debouncedSize.width, enabled]);

    return ref;
};
