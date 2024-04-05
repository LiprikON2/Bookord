export interface ViewItem<T> {
    id: string;
    visible: boolean;
    metadata: T | null;
}

export type ViewItemGroup<T> = {
    name: string;
    items: ViewItem<T>[];
};
