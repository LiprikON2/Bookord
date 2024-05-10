import Fuse from "fuse.js";

import { BookMetadata } from "../../BookStore";
import type {
    ActiveTags,
    Collection,
    Filter,
    FilterTags,
    TagCategory,
    TagName,
    ViewItem,
    ViewItemGroup,
} from "../interfaces";
import { BookMetadataGetter } from "../metadataGetters";

export class BookFilter<T extends BookMetadata> implements Filter<T> {
    constructor(
        private items: ViewItem<T>[],
        private collection: Collection,
        private metadataGetter: BookMetadataGetter<T>
    ) {}

    private sort(items: ViewItem<T>[]): ViewItem<T>[] {
        const { sort, sortBy } = this.collection;

        if (sortBy === "recent") {
            items.sort((itemA, itemB) => {
                const openDateA = itemA.fileMetadata.openedDate;
                const openDateB = itemB.fileMetadata.openedDate;

                // TODO tweak for never opened books
                if (sort === "ascending") {
                    if (!openDateA && openDateB) return 1;
                    if (openDateA && !openDateB) return -1;
                    if (!openDateA && !openDateB) return 0;
                    return openDateB.valueOf() - openDateA.valueOf();
                } else if (sort === "descending") {
                    if (!openDateA && openDateB) return -1;
                    if (openDateA && !openDateB) return 1;
                    if (!openDateA && !openDateB) return 0;
                    return openDateA.valueOf() - openDateB.valueOf();
                }
            });
        } else if (sortBy === "title") {
            items.sort((itemA, itemB) => {
                const titleA = this.metadataGetter.getTitle(itemA.metadata);
                const titleB = this.metadataGetter.getTitle(itemB.metadata);

                if (sort === "ascending") return titleA.localeCompare(titleB);
                else if (sort === "descending") return titleB.localeCompare(titleA);
            });
        } else if (sortBy === "publishYears") {
            items.sort((itemA, itemB) => {
                const [publishYearA] = this.metadataGetter.getPublishYears(itemA.metadata);
                const [publishYearB] = this.metadataGetter.getPublishYears(itemB.metadata);

                if (sort === "ascending") {
                    if (publishYearA === "Unknown" && publishYearB) return 1;
                    if (publishYearA && publishYearB === "Unknown") return -1;
                    if (publishYearA === "Unknown" && publishYearB === "Unknown") return 0;
                    return Number(publishYearB) - Number(publishYearA);
                } else if (sort === "descending") {
                    if (publishYearA === "Unknown" && publishYearB) return -1;
                    if (publishYearA && publishYearB === "Unknown") return 1;
                    if (publishYearA === "Unknown" && publishYearB === "Unknown") return 0;
                    return Number(publishYearA) - Number(publishYearB);
                }
            });
        }

        return items;
    }

    private search(items: ViewItem<T>[]) {
        const { searchTerm } = this.collection;
        if (!searchTerm) return items;

        const options = {
            keys: [
                {
                    name: "title",
                    getFn: (item: ViewItem<T>) =>
                        item.metadata ? this.metadataGetter.getTitle(item.metadata) : item.id,
                },
                {
                    name: "author",
                    getFn: (item: ViewItem<T>) =>
                        item.metadata ? this.metadataGetter.getAuthors(item.metadata) : "",
                },
            ],
        };

        const fuse = new Fuse(items, options);

        const foundItemIds = fuse.search(searchTerm).map((result) => result.item.id);

        const searchedItems = items.map((item) => ({
            ...item,
            visible: item.visible && foundItemIds.includes(item.id),
        }));

        return searchedItems;
    }

    private getActiveFilterTags(): Entries<ActiveTags> {
        const { filterTags } = this.collection;

        return Object.entries(filterTags)
            .map(([categoryKey, { tagsActive }]: [keyof FilterTags, TagCategory]) => [
                categoryKey,
                Array.from(tagsActive)
                    .filter(([tag, active]) => active)
                    .map(([tag]) => tag),
            ])
            .filter(
                ([categoryKey, activeTags]: [keyof FilterTags, TagName[]]) => activeTags.length
            ) as Entries<ActiveTags>;
    }

    private shouldBeVisible(
        item: ViewItem<T>,
        filterTags: Entries<ActiveTags>,
        filterTagsLogicalOp: Collection["logicalOp"]
    ) {
        const predicate = ([categoryKey, activeTags]: [keyof FilterTags, string[]]) => {
            const itemTags = this.metadataGetter.get(categoryKey, item.metadata, item.fileMetadata);
            const { logicalOp } = this.collection.filterTags[categoryKey];
            if (activeTags.length === 0) return true;
            else if (logicalOp === "and")
                return activeTags.every((activeTag) => itemTags.includes(activeTag));
            else if (logicalOp === "or")
                return activeTags.some((activeTag) => itemTags.includes(activeTag));
        };
        if (filterTagsLogicalOp === "and") return filterTags.every(predicate);
        else if (filterTagsLogicalOp === "or") return filterTags.some(predicate);
    }

    applyFilterTags(): this {
        const { logicalOp } = this.collection;

        const activeFilterTags = this.getActiveFilterTags();
        if (activeFilterTags.length === 0) return this;

        this.items = this.items.map((item) => ({
            ...item,
            visible: item.visible && this.shouldBeVisible(item, activeFilterTags, logicalOp),
        }));

        return this;
    }

    results(): ViewItemGroup<T>[] {
        const { groupBy, groupSort } = this.collection;

        const searchedItems = this.search(this.items);

        if (groupBy === "author") {
            const entries = Object.entries(
                Object.groupBy(searchedItems, ({ metadata }) => metadata?.author)
            );

            let sortedEntries: typeof entries;
            if (groupSort === "ascending") {
                sortedEntries = entries.sort(([a], [b]) => a.localeCompare(b));
            } else if (groupSort === "descending") {
                sortedEntries = entries.sort(([a], [b]) => b.localeCompare(a));
            }

            return sortedEntries.map(([name, items]) => ({ name, items: this.sort(items) }));
        }

        if (groupBy === "added") {
            const entries = Object.entries(
                Object.groupBy(searchedItems, ({ fileMetadata }) =>
                    this.metadataGetter.getRelativeDateGroupings(fileMetadata.addedDate).at(-1)
                )
            );
            const relativeGroupings = this.metadataGetter.getRelativeGroupingsList();

            let sortedEntries: typeof entries;
            if (groupSort === "ascending") {
                sortedEntries = entries.sort(
                    ([a], [b]) => relativeGroupings.indexOf(b) - relativeGroupings.indexOf(a)
                );
            } else if (groupSort === "descending") {
                sortedEntries = entries.sort(
                    ([a], [b]) => relativeGroupings.indexOf(a) - relativeGroupings.indexOf(b)
                );
            }

            return sortedEntries.map(([name, items]) => ({ name, items: this.sort(items) }));
        }
        if (groupBy === "recent") {
            const entries = Object.entries(
                Object.groupBy(searchedItems, ({ fileMetadata }) =>
                    this.metadataGetter
                        .getRelativeDateGroupings(fileMetadata.openedDate, "Never")
                        .at(-1)
                )
            );

            const relativeGroupings = this.metadataGetter.getRelativeGroupingsList("Never");

            let sortedEntries: typeof entries;
            if (groupSort === "ascending") {
                sortedEntries = entries.sort(
                    ([a], [b]) => relativeGroupings.indexOf(b) - relativeGroupings.indexOf(a)
                );
            } else if (groupSort === "descending") {
                sortedEntries = entries.sort(
                    ([a], [b]) => relativeGroupings.indexOf(a) - relativeGroupings.indexOf(b)
                );
            }

            return sortedEntries.map(([name, items]) => ({ name, items: this.sort(items) }));
        }
        if (groupBy === "publishYears") {
            const entries = Object.entries(
                Object.groupBy(
                    searchedItems,
                    ({ metadata }) => this.metadataGetter.getPublishYears(metadata)[0]
                )
            );

            let sortedEntries: typeof entries;
            if (groupSort === "ascending") {
                sortedEntries = entries.sort(([a], [b]) => Number(b) - Number(a));
            } else if (groupSort === "descending") {
                sortedEntries = entries.sort(([a], [b]) => Number(a) - Number(b));
            }

            return sortedEntries.map(([name, items]) => ({ name, items: this.sort(items) }));
        }

        if (groupBy === "none" || true) {
            return [
                {
                    name: "Ungrouped",
                    items: this.sort(searchedItems),
                },
            ];
        }
    }
}
