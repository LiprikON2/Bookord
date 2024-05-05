import { action, computed, makeAutoObservable, toJS } from "mobx";
import _ from "lodash";
import Fuse from "fuse.js";

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
} from "./interfaces";
import { BookFilter } from "./filters";
import { BookMetadataGetter } from "./metadataGetters";
import { RootStore } from "../RootStore";

/**
 * UI store
 *
 * ref: https://mobx.js.org/defining-data-stores.html#ui-stores
 */
export class BookViewStore {
    activeCollectionKey: CollectionKey | undefined;
    readonly rootStore: RootStore;

    private metadataGetter = new BookMetadataGetter();
    private mainCollection = this.getInitCollection();
    // userTags = new Map<BookKey, UserTag>();
    private userCollections = new Map<CollectionKey, Collection>();

    constructor(rootStore: RootStore) {
        makeAutoObservable(this, { rootStore: false });
        this.rootStore = rootStore;
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

    private newFilter(items: ViewItem<BookMetadata>[], collection: Collection) {
        return new BookFilter<BookMetadata>(items, collection, this.metadataGetter);
    }

    private getTagCategoryName(tagCategory: keyof FilterTags): string;
    private getTagCategoryName(
        tagCategory: keyof FilterTags,
        collectionKey?: CollectionKey
    ): string;
    private getTagCategoryName(tagCategory: keyof FilterTags, collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);
        return collection.filterTags[tagCategory].name;
    }

    private getSearchTerm(): string;
    private getSearchTerm(collectionKey?: CollectionKey): string;
    private getSearchTerm(collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);
        return collection.searchTerm;
    }

    private setSearchTerm(searchTerm: string): void;
    private setSearchTerm(searchTerm: string, collectionKey?: CollectionKey): void;
    private setSearchTerm(searchTerm: string, collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);
        collection.searchTerm = searchTerm;
    }

    private setTagsSearchTerm(searchTerm: string, tagCategory: keyof FilterTags): void;
    private setTagsSearchTerm(
        searchTerm: string,
        tagCategory: keyof FilterTags,
        collectionKey?: CollectionKey
    ): void;
    private setTagsSearchTerm(
        searchTerm: string,
        tagCategory: keyof FilterTags,
        collectionKey?: CollectionKey
    ) {
        const collection = this.get(collectionKey);
        collection.filterTags[tagCategory].searchTerm = searchTerm;
    }

    private getTags(tagCategory: keyof FilterTags): Tag[];
    private getTags(tagCategory: keyof FilterTags, collectionKey?: CollectionKey): Tag[];
    private getTags(tagCategory: keyof FilterTags, collectionKey?: CollectionKey) {
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

    private getTagsAll(): Tags;
    private getTagsAll(collectionKey?: CollectionKey): Tags;
    private getTagsAll(collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);

        return Object.fromEntries(
            Object.keys(collection.filterTags).map((tagCategory: keyof FilterTags) => [
                tagCategory,
                this.getTags(tagCategory, collectionKey),
            ])
        ) as any as Tags;
    }
    private sortTags(tags: Tag[], sortBy: TagCategory["sortBy"]): Tag[] {
        if (sortBy === "count") return tags.sort((tagA, tagB) => tagB.count - tagA.count);
        else if (sortBy === "name")
            return tags.sort((tagA, tagB) => tagB.name.localeCompare(tagA.name));
    }

    private setActiveTag(tagCategory: keyof FilterTags, tag: TagName, active: boolean): void;
    private setActiveTag(
        tagCategory: keyof FilterTags,
        tag: TagName,
        active: boolean,
        collectionKey?: CollectionKey
    ): void;
    private setActiveTag(
        tagCategory: keyof FilterTags,
        tag: TagName,
        active: boolean,
        collectionKey?: CollectionKey
    ) {
        const collection = this.get(collectionKey);
        if (collection.filterTags[tagCategory].tagsActive.has(tag))
            collection.filterTags[tagCategory].tagsActive.set(tag, active);
    }

    private categoriesHaveActiveTag(excludedCategories: (keyof FilterTags)[]): boolean;
    private categoriesHaveActiveTag(
        excludedCategories: (keyof FilterTags)[],
        collectionKey?: CollectionKey
    ): boolean;
    private categoriesHaveActiveTag(
        excludedCategories: (keyof FilterTags)[] = [],
        collectionKey?: CollectionKey
    ) {
        const collection = this.get(collectionKey);
        const tagCategories = _.difference(Object.keys(collection.filterTags), excludedCategories);
        return tagCategories.some((tagCategory: keyof FilterTags) =>
            this.categoryHasActiveTag(tagCategory, collectionKey)
        );
    }

    private categoryHasActiveTag(tagCategory: keyof FilterTags): boolean;
    private categoryHasActiveTag(
        tagCategory: keyof FilterTags,
        collectionKey?: CollectionKey
    ): boolean;
    private categoryHasActiveTag(tagCategory: keyof FilterTags, collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);

        return Array.from(collection.filterTags[tagCategory].tagsActive.values()).some(
            (active) => active
        );
    }

    private resetActiveTags(): void;
    private resetActiveTags(tagCategory?: keyof FilterTags): void;
    private resetActiveTags(tagCategory?: keyof FilterTags, collectionKey?: CollectionKey): void;
    private resetActiveTags(tagCategory?: keyof FilterTags, collectionKey?: CollectionKey) {
        const collection = this.get(collectionKey);

        if (tagCategory === undefined) {
            Object.keys(collection.filterTags).forEach((tagCategory: keyof FilterTags) => {
                const { tagsActive } = collection.filterTags[tagCategory];
                for (const tag of tagsActive.keys()) tagsActive.set(tag, false);
            });
        } else {
            const { tagsActive } = collection.filterTags[tagCategory];
            for (const tag of tagsActive.keys()) tagsActive.set(tag, false);
        }
    }

    private get(): Collection;
    private get(collectionKey?: CollectionKey): Collection;
    private get(collectionKey?: CollectionKey): Collection {
        const collection =
            collectionKey === undefined
                ? this.mainCollection
                : this.userCollections.get(collectionKey);

        if (!collection) throw Error(`Collection ${collectionKey} does not exist`);

        return collection;
    }

    private apply(items: ViewItem<BookMetadata>[]): ViewItemGroup<BookMetadata>[];
    private apply(
        items: ViewItem<BookMetadata>[],
        collectionKey?: CollectionKey
    ): ViewItemGroup<BookMetadata>[];
    private apply(
        items: ViewItem<BookMetadata>[],
        collectionKey?: CollectionKey
    ): ViewItemGroup<BookMetadata>[] {
        const collection = this.get(collectionKey);

        return this.newFilter(items, collection).applyFilterTags().results();
    }

    private populateFilterTags(items: ViewItem<BookMetadata>[]): void;
    private populateFilterTags(
        items: ViewItem<BookMetadata>[],
        collectionKey?: CollectionKey
    ): void;
    private populateFilterTags(items: ViewItem<BookMetadata>[], collectionKey?: CollectionKey) {
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
            for (const tagActive of tagsActive.keys()) {
                if (!tagsCountKeys.includes(tagActive)) tagsActive.delete(tagActive);
            }

            // Add tags to collection's tagsActive Map which are not present in items' metadata
            for (const tagCountKey of tagsCountKeys) {
                if (!tagsActive.has(tagCountKey)) tagsActive.set(tagCountKey, false);
            }
        });
    }

    private populateFilterTagsAll(items: ViewItem<BookMetadata>[]) {
        this.populateFilterTags(items);

        const userCollections = Array.from(this.userCollections.keys());
        userCollections.forEach((collection) => this.populateFilterTags(items, collection));
    }

    get search() {
        return this.getSearchTerm(this.activeCollectionKey);
    }

    setSearch(searchTerm: string) {
        this.setSearchTerm(searchTerm, this.activeCollectionKey);
    }

    get filterTitle() {
        const searchTerm = this.search;
        const categoriesHaveActiveTag = this.categoriesHaveActiveTag(
            ["recent"],
            this.activeCollectionKey
        );
        const metaBookRecords = this.rootStore.bookStore.getBookMetadataInStorage();
        const bookGroups = this.apply(metaBookRecords, this.activeCollectionKey);
        const visibleBookCount = bookGroups.reduce(
            (acc, cur) => cur.items.filter((item) => item.visible).length,
            0
        );

        const areBooksBeingSearched = !!searchTerm;
        const areBooksBeingTagFiltered = categoriesHaveActiveTag;
        const areBooksBeingFiltered = areBooksBeingSearched || areBooksBeingTagFiltered;

        if (areBooksBeingFiltered) {
            if (areBooksBeingSearched && !areBooksBeingTagFiltered) {
                if (visibleBookCount > 0) {
                    return `Results for '${searchTerm}' (${visibleBookCount})`;
                } else {
                    return `No results for '${searchTerm}'`;
                }
            } else if (!areBooksBeingSearched && areBooksBeingTagFiltered) {
                if (visibleBookCount > 0) {
                    return `Results for the tags filter (${visibleBookCount})`;
                } else {
                    return `No results for the tags filter '${searchTerm}'`;
                }
            } else if (areBooksBeingSearched && areBooksBeingTagFiltered) {
                if (visibleBookCount > 0) {
                    return `Results for the tags filter and '${searchTerm}' (${visibleBookCount})`;
                } else {
                    return `No results for the tags filter and '${searchTerm}'`;
                }
            }
        } else {
            return `All books (${visibleBookCount})`;
        }
    }

    get bookGroups() {
        const metaBookRecords = this.rootStore.bookStore.getBookMetadataInStorage();
        return this.apply(metaBookRecords, this.activeCollectionKey);
    }

    get isBookStorageEmpty() {
        return !this.rootStore.bookStore.getBookStateInStorage().length;
    }

    resetTags() {
        this.resetActiveTags(undefined, this.activeCollectionKey);
    }

    useTags(tagCategory: keyof FilterTags) {
        const getTags = () =>
            computed(() => this.getTags(tagCategory, this.activeCollectionKey)).get();

        const getCategoryName = () =>
            computed(() => this.getTagCategoryName(tagCategory, this.activeCollectionKey)).get();

        const getCategoryHasActiveTag = () =>
            computed(() => this.categoryHasActiveTag(tagCategory, this.activeCollectionKey)).get();

        const getOtherCategoriesHaveActiveTag = () =>
            computed(() =>
                this.categoriesHaveActiveTag([tagCategory], this.activeCollectionKey)
            ).get();

        const resetActiveTags = action(() =>
            this.resetActiveTags(tagCategory, this.activeCollectionKey)
        );

        const setActiveTag = action((tag: TagName, active: boolean) =>
            this.setActiveTag(tagCategory, tag, active, this.activeCollectionKey)
        );

        const setTagsSearchTerm = action((searchTerm: string) =>
            this.setTagsSearchTerm(searchTerm, tagCategory, this.activeCollectionKey)
        );

        return {
            getTags,
            getCategoryName,
            getCategoryHasActiveTag,
            getOtherCategoriesHaveActiveTag,
            resetActiveTags,
            setActiveTag,
            setTagsSearchTerm,
        };
    }

    updateTags() {
        const metaBookRecords = this.rootStore.bookStore.getBookMetadataInStorage();
        this.populateFilterTagsAll(metaBookRecords);
    }
}
