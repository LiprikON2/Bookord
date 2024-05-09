import React from "react";
import { observer } from "mobx-react-lite";
import { Anchor, Skeleton, Text } from "@mantine/core";

import type { BookMetadata } from "~/renderer/stores";
import classes from "./TitleGroup.module.css";

interface TitleGroupProps {
    metadata: BookMetadata;
    onAuthorClick: () => void;
    isAuthorVisible?: boolean;
}

export const TitleGroup = observer(
    ({ isAuthorVisible = true, metadata, onAuthorClick }: TitleGroupProps) => {
        return (
            <>
                <Text ta="center" fw={700} size="lg" className={classes.title}>
                    {metadata.title}
                </Text>
                <Text c="dimmed" ta="center" fz="sm">
                    by{" "}
                    {isAuthorVisible ? (
                        <Anchor inherit href="" onClick={onAuthorClick} underline="hover">
                            {metadata.author}
                        </Anchor>
                    ) : (
                        <Skeleton
                            display="inline-block"
                            component="span"
                            h={16}
                            w={120}
                            mb={-4}
                            radius="sm"
                        />
                    )}
                </Text>
            </>
        );
    }
);
