import Fuse from "fuse.js";
import { BookMetadata } from "../../BookStore";
import type {
    ActiveTags,
    Collection,
    Filter,
    FilterTags,
    MetadataGetter,
    TagCategory,
    TagName,
    Tags,
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
                const openDateA = this.metadataGetter.getOpenDate(itemA.metadata);
                const openDateB = this.metadataGetter.getOpenDate(itemB.metadata);

                if (sort === "ascending") return openDateB.valueOf() - openDateA.valueOf();
                else if (sort === "descending") return openDateA.valueOf() - openDateB.valueOf();
            });
        } else if (sortBy === "title") {
            items.sort((itemA, itemB) => {
                const titleA = this.metadataGetter.getTitle(itemA.metadata);
                const titleB = this.metadataGetter.getTitle(itemB.metadata);

                if (sort === "ascending") return titleB.localeCompare(titleA);
                else if (sort === "descending") return titleA.localeCompare(titleB);
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
                    getFn: (item: ViewItem<T>) => this.metadataGetter.getAuthors(item.metadata),
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
            const itemTags = this.metadataGetter.get(categoryKey, item.metadata);
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
        const { groupBy } = this.collection;

        if (groupBy === null)
            return [
                {
                    name: "Ungrouped",
                    items: this.sort(this.search(this.items)),
                },
            ];

        return [];
    }
}
