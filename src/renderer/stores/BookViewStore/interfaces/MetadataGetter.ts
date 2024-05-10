import { BookMetadata } from "../../BookStore";
import { ViewItem } from "./ViewItem";
import { FilterTags, TagName } from "./ViewStore";

// enum RelativeDateGroupings {
//     "Today",
//     "Yesterday",
//     "Earlier this month",
//     "Last month",
//     "Earlier this year",
//     "Last year",
// }

// export type RecentTagName = `${RelativeDateGroupings}`;

type RelativeDateGroupings =
    | "Today"
    | "Yesterday"
    | "Earlier this week"
    | "Last week"
    | "Earlier this month"
    | "Last month"
    | "Earlier this year"
    | "Last year"
    | "A long time ago";

export type RecentTagName = RelativeDateGroupings | "active" | string;
export interface MetadataGetter<T> {
    getAuthors(metadata: T): string;
    getTitle(metadata: T): string;

    getPublishYears(metadata: T): TagName[];
    getLanguages(metadata: T): TagName[];
    getSubjects(metadata: T): TagName[];
    getRelativeDateGroupings(date: Date): RecentTagName[];

    get(
        tag: keyof FilterTags,
        metadata: T | null,
        fileMetadata: ViewItem<T>["fileMetadata"]
    ): TagName[];
}
