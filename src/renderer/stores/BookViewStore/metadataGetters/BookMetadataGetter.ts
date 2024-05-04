import { BookMetadata, BookMetadataRaw } from "../../BookStore/BookStore";
import type { FilterTags, MetadataGetter, RecentTagName } from "../interfaces";

export class BookMetadataGetter<T extends BookMetadataRaw> implements MetadataGetter<T> {
    getPublishYears(metadata: T) {
        const year = new Date(metadata.date).getFullYear();
        const yearString = Number.isNaN(year) ? "Unknown" : year.toString();

        return [yearString];
    }
    getLanguages(metadata: T) {
        return Array.isArray(metadata.languages) ? metadata.languages : [];
    }
    getSubjects(metadata: T) {
        return Array.isArray(metadata.subjects) ? metadata.subjects : [];
    }

    getOpenDate(metadata: T) {
        // TODO
        const openBookDate = new Date("2024-04-04");
        return openBookDate;
    }

    getTitle(metadata: T) {
        return typeof metadata.title === "string" ? metadata.title : "";
    }
    getAuthors(metadata: T) {
        if (typeof metadata.author === "object") {
            if ("_" in metadata.author && typeof metadata.author?._ === "string") {
                return metadata.author._;
            } else return "Unknown";
        } else if (typeof metadata.author === "string" && metadata.author) return metadata.author;
        return metadata.author;
    }

    getRecent(metadata: T): RecentTagName[] {
        const currentDate = new Date();
        const openBookDate = this.getOpenDate(metadata);

        const timeDifference = currentDate.valueOf() - openBookDate.valueOf();
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        const relativeDateGroupings: RecentTagName[] = [];

        relativeDateGroupings.push("active");
        switch (true) {
            case daysDifference <= 0:
                relativeDateGroupings.push("Today");
                break;
            case daysDifference <= 1:
                relativeDateGroupings.push("Yesterday");
                break;
            case daysDifference <= 7:
                relativeDateGroupings.push("Earlier this week");
                break;
            case daysDifference <= 14:
                relativeDateGroupings.push("Last week");
                break;
            case daysDifference <= 30:
                relativeDateGroupings.push("Earlier this month");
                break;
            case daysDifference <= 60:
                relativeDateGroupings.push("Last month");
                break;
            case daysDifference <= 365:
                relativeDateGroupings.push("Earlier this year");
                break;
            case daysDifference <= 730:
                relativeDateGroupings.push("Last year");
                break;
            default:
                relativeDateGroupings.push("A long time ago");
                break;
        }

        return relativeDateGroupings;
    }

    get(tag: keyof FilterTags, metadata: T | null) {
        if (!metadata) return [];

        switch (tag) {
            case "publishYears":
                return this.getPublishYears(metadata);
            case "languages":
                return this.getLanguages(metadata);
            case "subjects":
                return this.getSubjects(metadata);
            case "recent":
                return this.getRecent(null);

            default:
                throw new Error(`Tag ${tag} is not implemented`);
        }
    }
}

export type ExtractBookMetadata<T> = T extends BookMetadataGetter<infer U> ? U : never;
