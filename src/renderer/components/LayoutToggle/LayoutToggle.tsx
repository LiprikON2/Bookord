import React from "react";
import { ActionIcon } from "@mantine/core";
import { IconColumns1, IconColumns2 } from "@tabler/icons-react";
import { observer } from "mobx-react-lite";

import { useBookReadStore } from "~/renderer/stores";
import classes from "./LayoutToggle.module.css";
import { action } from "mobx";

interface LayoutToggleProps {
    //
}

export const LayoutToggle = observer(() => {
    const bookReadStore = useBookReadStore();
    return (
        <ActionIcon
            onClick={action(() =>
                bookReadStore.setLayout(
                    bookReadStore.layout === "single-page" ? "two-page" : "single-page"
                )
            )}
            variant="default"
            aria-label="Toggle book layout"
            h="100%"
            w="auto"
            style={{ aspectRatio: "1 / 1" }}
            size="lg"
        >
            {bookReadStore.layout === "two-page" && (
                <IconColumns1 className={classes.icon} stroke={1.5} />
            )}
            {bookReadStore.layout === "single-page" && (
                <IconColumns2 className={classes.icon} stroke={1.5} />
            )}
        </ActionIcon>
    );
});
