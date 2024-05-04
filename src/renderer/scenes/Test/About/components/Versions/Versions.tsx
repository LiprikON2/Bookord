import React from "react";
import { Group } from "@mantine/core";
import { observer } from "mobx-react-lite";

import { Item } from "./components";

const Versions = observer(({ children }: { children: React.ReactNode }) => {
    return (
        <Group
            justify="center"
            maw="30rem"
            gap="md"
            my={0}
            mx="auto"
            style={{
                width: "80%",
            }}
        >
            {children}
        </Group>
    );
});

type Versions = typeof Versions;
interface VersionsCompositeOpt extends Versions {
    Item?: typeof Item;
}

const VersionsComposite: VersionsCompositeOpt = Versions;

VersionsComposite.Item = Item;
type VersionsComposite = Required<VersionsCompositeOpt>;

export { VersionsComposite as Versions };
