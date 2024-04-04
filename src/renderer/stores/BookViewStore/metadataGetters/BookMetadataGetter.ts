import { BookMetadata } from "../../BookStore/BookStore";
import type { FilterTags, MetadataGetter } from "../interfaces";

export class BookMetadataGetter<T extends BookMetadata> implements MetadataGetter<T> {
    getPublishYears(metadata: T) {
        const year = new Date(metadata.date).getFullYear();
        const yearString = Number.isNaN(year) ? "Unknown" : year.toString();

        return [yearString];
    }
    getLanguages(metadata: T) {
        return metadata.languages;
    }
    getSubjects(metadata: T) {
        return metadata.subjects;
    }

    get(tag: keyof FilterTags, metadata: T) {
        switch (tag) {
            case "publishYears":
                return this.getPublishYears(metadata);
            case "languages":
                return this.getLanguages(metadata);
            case "subjects":
                return this.getSubjects(metadata);
            case "recent":
                return [];

            default:
                throw new Error(`Tag ${tag} is not implemented`);
        }
    }
}

export type ExtractBookMetadata<T> = T extends BookMetadataGetter<infer U> ? U : never;
