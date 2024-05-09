import React, { useEffect, useState } from "react";
import { useDebouncedValue, useFocusWithin, useWindowEvent } from "@mantine/hooks";
import { CloseButton, Pill, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { reaction } from "mobx";
import { observer } from "mobx-react-lite";

import { useBookViewStore } from "~/renderer/stores";
import classes from "./SearchInput.module.css";

export const SearchInput = observer(() => {
    const { ref, focused } = useFocusWithin<HTMLInputElement>();

    const bookViewStore = useBookViewStore();
    const [searchTermValue, setSearchTermValue] = useState("");
    const [debouncedSearchTerm] = useDebouncedValue(searchTermValue, 100, { leading: true });
    useEffect(() => bookViewStore.setSearch(debouncedSearchTerm), [debouncedSearchTerm]);

    /* Updates input value when something other than input changes search term */
    useEffect(() => {
        const unsub = reaction(
            () => bookViewStore.search,
            () => {
                if (!focused) setSearchTermValue(bookViewStore.search);
            }
        );
        return unsub;
    }, [bookViewStore.search, focused]);

    useWindowEvent("keydown", (event) => {
        if (event.code === "KeyP" && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            ref.current.focus();
        }
    });
    return (
        <TextInput
            ref={ref}
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
                !focused && !searchTermValue ? (
                    <Pill className={classes.pill} visibleFrom="sm" radius="lg">
                        Ctrl + P
                    </Pill>
                ) : searchTermValue ? (
                    <CloseButton
                        variant="transparent"
                        size="sm"
                        onClick={() => setSearchTermValue("")}
                    />
                ) : null
            }
        />
    );
});
