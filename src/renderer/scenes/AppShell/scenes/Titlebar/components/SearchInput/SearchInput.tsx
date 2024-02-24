import React, { useEffect, useRef, useState } from "react";
import { useDebouncedValue, useWindowEvent } from "@mantine/hooks";
import { Pill, TextInput, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import { useBooks } from "~/renderer/hooks";
import classes from "./SearchInput.module.css";

export const SearchInput = () => {
    const [searchTermValue, setSearchTermValue] = useState("");
    const [debouncedSearchTerm] = useDebouncedValue(searchTermValue, 50, { leading: true });

    const { setSearchTerm } = useBooks();
    useEffect(() => setSearchTerm(debouncedSearchTerm), [debouncedSearchTerm]);

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
            value={searchTermValue}
            onChange={(e) => setSearchTermValue(e.currentTarget.value)}
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
