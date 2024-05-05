import { useEffect, useState } from "react";

type Versions = Record<string, string>;

export const useVersions = () => {
    const [versions, setVersions] = useState<Versions>({});

    useEffect(() => {
        // Apply verisons
        const app = document.getElementById("app");
        const versions = JSON.parse(app.getAttribute("data-versions"));
        setVersions(versions);
    }, []);

    return [versions, setVersions] as [typeof versions, typeof setVersions];
};
