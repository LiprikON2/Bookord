import { Filter } from "./Filter";
import { MetadataGetter } from "./MetadataGetter";
import { ViewItem, ViewItemGroup } from "./ViewItem";

export type TagName = string;
export type TagCategory = {
    name: string;
    order: number;
    /** Logical operator between `tagsActive` */
    logicalOp: "or" | "and";
    sortBy: "count" | "name";
    tagsActive: Map<TagName, boolean>;
    tagsCount: Map<TagName, number>;
    searchTerm: string;
};

export interface FilterTags {
    recent: TagCategory;
    publishYears: TagCategory;
    languages: TagCategory;
    subjects: TagCategory;
}

export interface Tag {
    name: TagName;
    visible: boolean;
    active: boolean;
    count: number;
}

export interface Tags {
    recent: Tag[];
    publishYears: Tag[];
    languages: Tag[];
    subjects: Tag[];
}

export type CollectionKey = string;
export interface Collection {
    searchTerm: string;
    filterTags: FilterTags;
    /** Logical operator between `filterTags` */
    logicalOp: "or" | "and";
    // filterTagRelations: {
    //     logicalAnd: Map<keyof FilterTags, Set<keyof FilterTags>>;
    //     logicalOr: Map<keyof FilterTags, Set<keyof FilterTags>>;
    // };
    sort: "ascending" | "descending";
    sortBy: "title" | "recent";
    groupBy: keyof FilterTags | null;
}

export interface ViewStore<T> {
    metadataGetter: MetadataGetter<T>;
    mainCollection: Collection;
    userCollections: Map<CollectionKey, Collection>;

    newFilter(...args: any[]): Filter<T>;

    sortTags(tags: Tag[], sortBy: TagCategory["sortBy"]): Tag[];

    getTagCategoryName(tagCategory: keyof FilterTags): string;
    getTagCategoryName(tagCategory: keyof FilterTags, collectionKey?: CollectionKey): string;

    categoryHasActiveTag(tagCategory: keyof FilterTags): boolean;
    categoryHasActiveTag(tagCategory: keyof FilterTags, collectionKey?: CollectionKey): boolean;

    setSearchTerm(searchTerm: string): void;
    setSearchTerm(searchTerm: string, collectionKey?: CollectionKey): void;

    setTagsSearchTerm(searchTerm: string, tagCategory: keyof FilterTags): void;
    setTagsSearchTerm(
        searchTerm: string,
        tagCategory: keyof FilterTags,
        collectionKey?: CollectionKey
    ): void;

    getTags(tagCategory: keyof FilterTags): Tag[];
    getTags(tagCategory: keyof FilterTags, collectionKey?: CollectionKey): Tag[];

    getTagsAll(): Tags;
    getTagsAll(collectionKey?: CollectionKey): Tags;

    setActiveTag(tagCategory: keyof FilterTags, tag: TagName, active: boolean): void;
    setActiveTag(
        tagCategory: keyof FilterTags,
        tag: TagName,
        active: boolean,
        collectionKey?: CollectionKey
    ): void;

    resetActiveTags(tagCategory: keyof FilterTags): void;
    resetActiveTags(tagCategory: keyof FilterTags, collectionKey?: CollectionKey): void;

    hasActiveTag(excludedTagCategories: (keyof FilterTags)[]): boolean;
    hasActiveTag(
        excludedTagCategories: (keyof FilterTags)[],
        collectionKey?: CollectionKey
    ): boolean;

    get(): Collection;
    get(collectionKey?: CollectionKey): Collection;

    apply(items: ViewItem<T>[]): ViewItemGroup<T>[];
    apply(items: ViewItem<T>[], collectionKey?: CollectionKey): ViewItemGroup<T>[];
}
