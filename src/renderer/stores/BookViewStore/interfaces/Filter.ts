import type { ViewItem, ViewItemGroup } from "./ViewItem";

export interface Filter<T> {
    // applyAll(): ViewItem<T>[];

    // applySearchTerm(): this;

    applyFilterTags(): this;

    // applySort(): this;

    results(): ViewItemGroup<T>[];
}
