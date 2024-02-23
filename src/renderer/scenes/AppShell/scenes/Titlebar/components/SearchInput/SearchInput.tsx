import React, { useRef, useState } from "react";
import { useDebouncedValue, useWindowEvent } from "@mantine/hooks";
import { Pill, TextInput, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import classes from "./SearchInput.module.css";

export const SearchInput = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm] = useDebouncedValue(searchTerm, 200, { leading: true });

    const inputRef = useRef<HTMLInputElement>();

    useWindowEvent("keydown", (event) => {
        if (event.code === "KeyP" && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            inputRef.current.focus();
        }
    });
    return (
        <TextInput
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            size="xs"
            w="100%"
            placeholder="Search for books"
            radius="lg"
            classNames={{
                input: classes.input,
                section: classes.section,
            }}
            leftSectionPointerEvents="none"
            leftSection={<IconSearch className={classes.icon} stroke={1.5} />}
            rightSection={
                <Pill className={classes.pill} visibleFrom="sm" radius="lg">
                    Ctrl + K
                </Pill>
            }
        />
    );
};
