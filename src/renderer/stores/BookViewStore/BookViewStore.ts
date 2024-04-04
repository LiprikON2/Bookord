import { makeAutoObservable } from "mobx";

import { BookMetadata } from "../BookStore";
import type {
    Collection,
    CollectionKey,
    FilterTags,
    Tag,
    TagCategory,
    TagName,
    Tags,
    ViewItem,
    ViewItemGroup,
    ViewStore,
} from "./interfaces";
import { BookFilter } from "./filters";
import { BookMetadataGetter } from "./metadataGetters";
import _ from "lodash";
import Fuse from "fuse.js";

/**
 * UI store
 *
 * ref: https://mobx.js.org/defining-data-stores.html#ui-stores
 */
export class BookViewStore<T extends BookMetadata> implements ViewStore<T> {
    metadataGetter = new BookMetadataGetter();
    mainCollection = this.getInitCollection();
    // userTags = new Map<BookKey, UserTag>();
    userCollections = new Map<CollectionKey, Collection>();

    test() {
        this.mainCollection.filterTags.subjects.tagsActive.set("ha", true);
    }

    constructor() {
        makeAutoObservable(this);
    }

    private getInitCollection(): Collection {
        const filterTags = this.getInitFilterTags();
        return {
            searchTerm: "",
            filterTags,
            logicalOp: "and",
            sort: "descending",
            sortBy: "recent",
            groupBy: null,
        };
    }

    private getInitFilterTags(): FilterTags {
        return {
            // TODO handle sort of recent tags
            recent: this.getInitTagCategory("Recent", 0),
            subjects: this.getInitTagCategory("Genres", 1),
            publishYears: this.getInitTagCategory("Year", 2, "name"),
            languages: this.getInitTagCategory("Language", 3),
        };
    }

    private getInitTagCategory(
        name: TagCategory["name"],
        order: TagCategory["order"],
        sortBy: TagCategory["sortBy"] = "count"
    ): TagCategory {
        return {
            name,
            order,
            sortBy,
            logicalOp: "or",
            tagsActive: new Map(),
            tagsCount: new Map(),
            searchTerm: "",
        };
    }

    newFilter(items: ViewItem<T>[], collection: Collection) {
        return new BookFilter<T>(items, collection, this.metadataGetter);
    }

    getTagCategoryName(tagCategory: keyof FilterTags): string;
    getTagCategoryName(tagCategory: keyof FilterTags, collectionKey?: CollectionKey): string;
    getTagCategoryName(tagCategory: keyof FilterTags, collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);
        return collection.filterTags[tagCategory].name;
    }

    setSearchTerm(searchTerm: string): void;
    setSearchTerm(searchTerm: string, collectionKey?: CollectionKey): void;
    setSearchTerm(searchTerm: string, collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);
        collection.searchTerm = searchTerm;
    }
    setTagsSearchTerm(searchTerm: string, tagCategory: keyof FilterTags): void;
    setTagsSearchTerm(
        searchTerm: string,
        tagCategory: keyof FilterTags,
        collectionKey?: CollectionKey
    ): void;
    setTagsSearchTerm(
        searchTerm: string,
        tagCategory: keyof FilterTags,
        collectionKey?: CollectionKey
    ) {
        const collection = this.get(collectionKey);
        collection.filterTags[tagCategory].searchTerm = searchTerm;
    }

    getTags(tagCategory: keyof FilterTags): Tag[];
    getTags(tagCategory: keyof FilterTags, collectionKey?: CollectionKey): Tag[];
    getTags(tagCategory: keyof FilterTags, collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);

        const { tagsActive, tagsCount, searchTerm, sortBy } = collection.filterTags[tagCategory];

        const tagNames = Array.from(tagsActive.keys());

        let tags: Tag[];
        if (searchTerm) {
            const fuse = new Fuse(tagNames);
            const filteredTagNames = fuse.search(searchTerm).map((result) => result.item);
            const filteredOutTagNames = _.difference(tagNames, filteredTagNames);

            const filteredTags = filteredTagNames.map((tagName) => ({
                name: tagName,
                active: tagsActive.get(tagName),
                count: tagsCount.get(tagName),
                visible: true,
            }));
            const filteredOutTags = filteredOutTagNames.map((tagName) => ({
                name: tagName,
                active: tagsActive.get(tagName),
                count: tagsCount.get(tagName),
                visible: false,
            }));
            tags = [...filteredTags, ...this.sortTags(filteredOutTags, sortBy)];
        } else {
            const filteredTags = tagNames.map((tagName) => ({
                name: tagName,
                active: tagsActive.get(tagName),
                count: tagsCount.get(tagName),
                visible: true,
            }));
            tags = this.sortTags(filteredTags, sortBy);
        }

        return tags;
    }

    sortTags(tags: Tag[], sortBy: TagCategory["sortBy"]): Tag[] {
        if (sortBy === "count") return tags.sort((tagA, tagB) => tagB.count - tagA.count);
        else if (sortBy === "name")
            return tags.sort((tagA, tagB) => tagB.name.localeCompare(tagA.name));
    }

    getTagsAll(): Tags;
    getTagsAll(collectionKey?: CollectionKey): Tags;
    getTagsAll(collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);

        return Object.fromEntries(
            Object.keys(collection.filterTags).map((tagCategory: keyof FilterTags) => [
                tagCategory,
                this.getTags(tagCategory, collectionKey),
            ])
        ) as any as Tags;
    }

    setActiveTag(tagCategory: keyof FilterTags, tag: TagName, active: boolean): void;
    setActiveTag(
        tagCategory: keyof FilterTags,
        tag: TagName,
        active: boolean,
        collectionKey?: CollectionKey
    ): void;
    setActiveTag(
        tagCategory: keyof FilterTags,
        tag: TagName,
        active: boolean,
        collectionKey?: CollectionKey
    ) {
        const collection = this.get(collectionKey);
        if (collection.filterTags[tagCategory].tagsActive.has(tag))
            collection.filterTags[tagCategory].tagsActive.set(tag, active);
    }

    hasActiveTag(excludedTagCategories: (keyof FilterTags)[]): boolean;
    hasActiveTag(
        excludedTagCategories: (keyof FilterTags)[],
        collectionKey?: CollectionKey
    ): boolean;
    hasActiveTag(excludedTagCategories: (keyof FilterTags)[] = [], collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);
        const tagCategories = _.difference(
            Object.keys(collection.filterTags),
            excludedTagCategories
        );
        return tagCategories.some((tagCategory: keyof FilterTags) =>
            this.categoryHasActiveTag(tagCategory, collectionKey)
        );
    }

    categoryHasActiveTag(tagCategory: keyof FilterTags): boolean;
    categoryHasActiveTag(tagCategory: keyof FilterTags, collectionKey?: CollectionKey): boolean;
    categoryHasActiveTag(tagCategory: keyof FilterTags, collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);

        return Array.from(collection.filterTags[tagCategory].tagsActive.values()).some(
            (active) => active
        );
    }

    resetActiveTags(): void;
    resetActiveTags(tagCategory?: keyof FilterTags): void;
    resetActiveTags(tagCategory?: keyof FilterTags, collectionKey?: CollectionKey): void;
    resetActiveTags(tagCategory?: keyof FilterTags, collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);

        if (tagCategory === undefined) {
            Object.keys(collection.filterTags).forEach((tagCategory: keyof FilterTags) => {
                const { tagsActive } = collection.filterTags[tagCategory];
                for (let tag of tagsActive.keys()) tagsActive.set(tag, false);
            });
        } else {
            const { tagsActive } = collection.filterTags[tagCategory];
            for (let tag of tagsActive.keys()) tagsActive.set(tag, false);
        }
    }

    get(): Collection;
    get(collectionKey?: CollectionKey): Collection;
    get(collectionKey?: CollectionKey): Collection {
        const collection =
            collectionKey === undefined
                ? this.mainCollection
                : this.userCollections.get(collectionKey);

        if (!collection) throw Error(`Collection ${collectionKey} does not exist`);

        return collection;
    }

    apply(items: ViewItem<T>[]): ViewItemGroup<T>[];
    apply(items: ViewItem<T>[], collectionKey?: CollectionKey): ViewItemGroup<T>[];
    apply(items: ViewItem<T>[], collectionKey?: CollectionKey): ViewItemGroup<T>[] {
        const collection = this.get(collectionKey);

        return this.newFilter(items, collection).applyFilterTags().results();
    }

    populateFilterTags(items: ViewItem<T>[]): void;
    populateFilterTags(items: ViewItem<T>[], collectionKey?: CollectionKey): void;
    populateFilterTags(items: ViewItem<T>[], collectionKey?: CollectionKey) {
        const itemsWithMetadata = items.filter((item) => item.metadata);
        if (!itemsWithMetadata.length) return;

        const collection = this.get(collectionKey);

        Object.keys(collection.filterTags).forEach((categoryKey: keyof FilterTags) => {
            const tagsCountObj: { [tag: string]: number } = {};

            itemsWithMetadata.forEach((item) => {
                const itemTags = this.metadataGetter.get(categoryKey, item.metadata);

                itemTags.forEach((itemTag) => {
                    if (!(itemTag in tagsCountObj)) tagsCountObj[itemTag] = 1;
                    else tagsCountObj[itemTag] += 1;
                });
            });
            const tagsCountEntries = Object.entries(tagsCountObj);
            collection.filterTags[categoryKey].tagsCount = new Map(tagsCountEntries);

            const tagsCountKeys = Object.keys(tagsCountObj);
            const tagsActive = collection.filterTags[categoryKey].tagsActive;

            // Remove tags from collection's tagsActive Map not present in items' metadata
            for (let tagActive of tagsActive.keys()) {
                if (!tagsCountKeys.includes(tagActive)) tagsActive.delete(tagActive);
            }

            // Add tags to collection's tagsActive Map which are not present in items' metadata
            for (let tagCountKey of tagsCountKeys) {
                if (!tagsActive.has(tagCountKey)) tagsActive.set(tagCountKey, false);
            }
        });
    }

    populateFilterTagsAll(items: ViewItem<T>[]) {
        this.populateFilterTags(items);

        const userCollections = Array.from(this.userCollections.keys());
        userCollections.forEach((collection) => this.populateFilterTags(items, collection));
    }
}
