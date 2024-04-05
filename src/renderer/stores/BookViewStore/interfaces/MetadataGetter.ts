import { BookMetadata } from "../../BookStore";
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

export type RecentTagName = RelativeDateGroupings | "active";
export interface MetadataGetter<T> {
    getAuthors(metadata: T): string;
    getTitle(metadata: T): string;

    getPublishYears(metadata: T): TagName[];
    getLanguages(metadata: T): TagName[];
    getSubjects(metadata: T): TagName[];
    getRecent(metadata: T): RecentTagName[];

    get(tag: keyof FilterTags, metadata: T): TagName[];
}
