declare module "*.css";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.webp";
declare module "*.avif";

declare type FileObj = {
    path: string;
    name: string;
    size?: number;
    lastModified?: number;
};

type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];

type ArrayElement<ArrayType extends readonly unknown[]> =
    ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
