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
