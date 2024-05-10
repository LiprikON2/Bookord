export interface ViewItem<T> {
    id: string;
    visible: boolean;
    metadata: T | null;
    fileMetadata: {
        addedDate: Date;
        openedDate: Date;
    };
}

export type ViewItemGroup<T> = {
    name: string;
    items: ViewItem<T>[];
};
