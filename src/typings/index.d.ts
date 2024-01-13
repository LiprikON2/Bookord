declare module "*.css";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.avif";

declare type FileObj = {
    path: string;
    size: number;
    name: string;
    lastModified: number;
};
