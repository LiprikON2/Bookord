import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

export const useIsMobile = () => {
    const isMobile = useMediaQuery(`(max-width: ${em(768)})`);

    return isMobile;
};
