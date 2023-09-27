import { useEffect, useState } from "react";

type Versions = Record<string, string>;

export const useVersions = () => {
    useEffect(() => {
        // Apply verisons
        const app = document.getElementById("app");
        const versions = JSON.parse(app.getAttribute("data-versions"));
        setVersions(versions);
    }, []);

    const [versions, setVersions] = useState<Versions>({});

    return [versions, setVersions] as [typeof versions, typeof setVersions];
};
