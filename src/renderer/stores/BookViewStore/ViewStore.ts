import { makeAutoObservable } from "mobx";
import { BookKey, BookMetadata } from "../BookStore/BookStore";
import _ from "lodash";

export type TagName = string;
export type TagCategory = {
    name: string;
    order: number;
    tagsState: Map<TagName, { active: boolean; count: number }>;
};

export interface FilterTags {
    recent: TagCategory;
    publishYears: TagCategory;
    languages: TagCategory;
    subjects: TagCategory;
}

export type CollectionKey = string;
export interface Collection {
    searchTerm: string;
    filterTags: FilterTags;
    filterTagRelations: {
        logicalAnd: Map<keyof FilterTags, Set<keyof FilterTags>>;
        logicalOr: Map<keyof FilterTags, Set<keyof FilterTags>>;
    };
    sort: "ascending" | "descending";
    groupBy: keyof FilterTags | null;
}

export type ExtractedTags = {
    publishYears: TagName;
    languages: TagName[];
    subjects: TagName[];
};

export interface MetadataGetter {
    getPublishYears(metadata: any): TagName;
    getLanguages(metadata: any): TagName[];
    getSubjects(metadata: any): TagName[];
    get(tag: keyof ExtractedTags, metadata: any): TagName | TagName[];
}

/**
 * UI store
 *
 * ref: https://mobx.js.org/defining-data-stores.html#ui-stores
 */
export class ViewStore {
    mainCollection: Collection;
    // userTags = new Map<BookKey, UserTag>();
    userCollections = new Map<CollectionKey, Collection>();

    constructor(public metadataGetter: MetadataGetter) {
        makeAutoObservable(this);
    }
}
