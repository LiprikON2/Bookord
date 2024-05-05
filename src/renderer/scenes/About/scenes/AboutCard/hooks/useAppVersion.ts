import { useEffect, useState } from "react";

import context from "~/main/mainContextApi";

export const useAppVersion = () => {
    const [version, setVersion] = useState("");

    useEffect(() => {
        const getVersion = async () => {
            const bookordVersion = await context.version();
            setVersion(bookordVersion);
        };
        getVersion();
    }, []);

    return version;
};
