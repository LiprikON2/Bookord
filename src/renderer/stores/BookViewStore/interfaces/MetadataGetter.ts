import { FilterTags, TagName } from "./ViewStore";

// export type ExtractedTags = {
//     publishYears: TagName;
//     languages: TagName[];
//     subjects: TagName[];
// };

export interface MetadataGetter<T> {
    getPublishYears(metadata: T): TagName[];
    getLanguages(metadata: T): TagName[];
    getSubjects(metadata: T): TagName[];
    get(tag: keyof FilterTags, metadata: T): TagName | TagName[];
}
