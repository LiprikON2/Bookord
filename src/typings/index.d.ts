declare module "*.css";
// declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.webp";
declare module "*.avif";

declare module "*.svg" {
    const content: any;
    export default content;
}

declare type FileObj = {
    path: string;
    name: string;
    size?: number;
    lastModified?: number;
};

type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

type Required<T> = {
    [P in keyof T]-?: T[P];
};

type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

// Object.groupBy support (it should have been added to ts 5.4)
interface ObjectConstructor {
    /**
     * Groups members of an iterable according to the return value of the passed callback.
     * @param items An iterable.
     * @param keySelector A callback which will be invoked for each item in items.
     */
    groupBy<K extends PropertyKey, T>(
        items: Iterable<T>,
        keySelector: (item: T, index: number) => K
    ): Partial<Record<K, T[]>>;
}
