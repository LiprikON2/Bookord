import React from "react";
import { Pill, TextInput, rem } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

import classes from "./SearchInput.module.css";

export const SearchInput = () => {
    return (
        <TextInput
            size="xs"
            w="100%"
            placeholder="Search for books"
            radius="lg"
            leftSectionPointerEvents="none"
            leftSection={<IconSearch className={classes.icon} stroke={1.5} />}
            rightSection={
                <Pill
                    style={{
                        borderRadius: "var(--mantine-radius-default)",
                    }}
                >
                    Ctrl + K
                </Pill>
            }
            classNames={{
                input: classes.input,
                section: classes.section,
            }}
        />
    );
};
