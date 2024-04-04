import { useState } from "react";
import { useShallowEffect } from "@mantine/hooks";
import _ from "lodash";
import Fuse from "fuse.js";

type FilterableEntries = Entries<{
    [key: string]: {
        value: number;
        visible: boolean;
    };
}>;

const toFilterable = <T extends { [key: string]: any }>(
    items: T,
    filteredKeys: string[] = []
): FilterableEntries => {
    const filteredOutKeys = _.difference(Object.keys(items), filteredKeys);

    const filteredEntries: FilterableEntries = filteredKeys.map((key) => [
        key,
        { value: items[key], visible: true },
    ]);
    const filteredOutEntries: FilterableEntries = filteredOutKeys.map((key) => [
        key,
        { value: items[key], visible: !filteredKeys.length },
    ]);

    return [...filteredEntries, ...filteredOutEntries];
};

export const useFilterable = (items: { [key: string]: any }, filterTerm: string) => {
    const [filteredEntries, setFilteredEntries] = useState(toFilterable(items));

    useShallowEffect(() => {
        if (filterTerm) {
            const fuse = new Fuse(Object.keys(items));
            const filteredKeys = fuse.search(filterTerm).map((result) => result.item);

            setFilteredEntries(toFilterable(items, filteredKeys));
        } else setFilteredEntries(toFilterable(items));
    }, [filterTerm, Object.keys(items)]);

    return filteredEntries;
};
