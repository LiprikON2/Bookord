import { BookMetadata } from "../../BookStore";
import type {
    Collection,
    Filter,
    FilterTags,
    MetadataGetter,
    TagCategory,
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

    // applyAll(): ViewItem<T>[] {
    //     this.applySearchTerm().applyFilterTags().applySort().applyGroupBy();

    //     return this.items;
    // }

    // applySearchTerm(): this {
    //     const { searchTerm } = this.collection;
    //     // Filter items based on search term
    //     // this.items = ...;

    //     return this;
    // }

    sort(items: ViewItem<T>[]): ViewItem<T>[] {
        const { sort, sortBy } = this.collection;

        if (sortBy === "recent") {
            this.items.sort((itemA, itemB) => {
                const openDateA = this.metadataGetter.getOpenDate(itemA.metadata);
                const openDateB = this.metadataGetter.getOpenDate(itemB.metadata);

                if (sort === "ascending") return openDateB.valueOf() - openDateA.valueOf();
                else if (sort === "descending") return openDateA.valueOf() - openDateB.valueOf();
            });
        } else if (sortBy === "title") {
            this.items.sort((itemA, itemB) => {
                const titleA = this.metadataGetter.getTitle(itemA.metadata);
                const titleB = this.metadataGetter.getTitle(itemB.metadata);

                if (sort === "ascending") return titleB.localeCompare(titleA);
                else if (sort === "descending") return titleA.localeCompare(titleB);
            });
        }

        return items;
    }

    search(items: ViewItem<T>[]) {
        const { searchTerm } = this.collection;
        // TODO use `visible: false` instead of filtering
        return items;
    }

    getActiveFilterTags() {
        const { filterTags } = this.collection;

        return Object.entries(filterTags)
            .map(([categoryKey, { tagsActive }]: [keyof FilterTags, TagCategory]) => [
                categoryKey,
                Array.from(tagsActive)
                    .filter(([tag, active]) => active)
                    .map(([tag]) => tag),
            ])
            .filter(([categoryKey, activeTags]) => activeTags.length);
    }

    applyFilterTags(): this {
        const { logicalOp: filterTagsLogicalOp } = this.collection;

        const activeFilterTags = this.getActiveFilterTags();
        if (activeFilterTags.length === 0) return this;

        // TODO use `visible: false` instead of filtering
        this.items = this.items.filter((item) => {
            const predicate = ([categoryKey, activeTags]: [keyof FilterTags, string[]]) => {
                const itemTags = this.metadataGetter.get(categoryKey, item.metadata);
                const { logicalOp } = this.collection.filterTags[categoryKey];

                if (activeTags.length === 0) return true;
                else if (logicalOp === "and")
                    return activeTags.every((activeTag) => itemTags.includes(activeTag));
                else if (logicalOp === "or")
                    return activeTags.some((activeTag) => itemTags.includes(activeTag));
            };

            if (filterTagsLogicalOp === "and") return activeFilterTags.every(predicate);
            else if (filterTagsLogicalOp === "or") return activeFilterTags.some(predicate);
        });

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
