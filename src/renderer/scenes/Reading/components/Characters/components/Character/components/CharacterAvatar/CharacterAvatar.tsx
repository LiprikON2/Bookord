import React, { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";

import classes from "./CharacterAvatar.module.css";
import { Avatar } from "@mantine/core";

interface CharacterAvatarProps {
    seed: string;
    //
}

export const CharacterAvatar = observer(({ seed }: CharacterAvatarProps) => {
    const avatar = useMemo(() => {
        return createAvatar(adventurer, {
            seed,
            scale: 110,
        }).toDataUriSync();
    }, [seed]);

    return <Avatar src={avatar} radius="xl" />;
});
