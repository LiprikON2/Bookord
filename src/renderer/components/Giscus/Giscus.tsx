import React, { useEffect } from "react";
import GiscusReact from "@giscus/react";
import { useLocalStorage, useWindowEvent } from "@mantine/hooks";
import { observer } from "mobx-react-lite";

import context from "~/renderer/ipc/thirdPartyApi";
import { useColorScheme } from "~/renderer/hooks";
import classes from "./Giscus.module.css";

interface GiscusProps {
    //
}

export const Giscus = observer(({}: GiscusProps) => {
    const [giscusParam, setGiscusParam] = useLocalStorage<string>({
        key: "giscus-session",
    });
    const { colorSceme } = useColorScheme();

    useEffect(() => {
        const unsub = context.handleOauthGiscus((giscusParam) => {
            setGiscusParam(giscusParam);
        });

        return () => unsub();
    }, []);

    // useWindowEvent("message", (e) => {
    //     console.log("data", e.data?.giscus);
    // });

    return (
        <GiscusReact
            key={giscusParam}
            id="comments"
            repo="LiprikON2/Bookord"
            repoId="R_kgDOLtwkCA"
            category="In-app book comments"
            categoryId="DIC_kwDOLtwkCM4CfSum"
            mapping="title"
            strict="1"
            reactionsEnabled="1"
            emitMetadata="1"
            inputPosition="top"
            theme={colorSceme}
            lang="en"
            loading="lazy"
        />
    );
});
