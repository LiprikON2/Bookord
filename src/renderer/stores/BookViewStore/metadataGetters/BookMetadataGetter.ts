import { BookMetadata } from "../../BookStore/BookStore";
import { ExtractedTags, MetadataGetter } from "../ViewStore";

export class BookMetadataGetter<T extends BookMetadata> implements MetadataGetter {
    getPublishYears(metadata: T) {
        const year = new Date(metadata.date).getFullYear();
        const yearString = Number.isNaN(year) ? "Unknown" : year.toString();

        return yearString;
    }
    getLanguages(metadata: T) {
        return metadata.languages;
    }
    getSubjects(metadata: T) {
        return metadata.subjects;
    }

    get(tag: "publishYears" | "languages" | "subjects", metadata: T) {
        switch (tag) {
            case "publishYears":
                return this.getPublishYears(metadata);
            case "languages":
                return this.getLanguages(metadata);
            case "subjects":
                return this.getSubjects(metadata);

            default:
                throw new Error(`Tag ${tag} is not implemented`);
        }
    }
}
