export interface ViewItem<T> {
    id: string;
    metadata: T;
}

export type ViewItemGroup<T> = {
    name: string;
    items: ViewItem<T>[];
};
