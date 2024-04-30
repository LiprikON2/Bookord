import { useEffect, useState } from "react";

export const usePlatform = () => {
    const [platform, setPlatform] = useState<NodeJS.Platform>(null);

    useEffect(() => {
        const app = document.getElementById("app");
        const versions = JSON.parse(app.getAttribute("data-platform"));
        setPlatform(versions);
    }, []);

    return platform;
};
