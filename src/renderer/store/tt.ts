import { makeAutoObservable, runInAction, reaction } from "mobx";

type BookState = {
    isMetadataParsed: boolean;
    isInitSectionParsed: boolean;
    isFullyParsed: boolean;
    parsedSections: number[];
    sectionNames: string[];
};

type BookMetadata = {
    title: string;
    description: string;
    date: string;
    cover: string;
    author: string;
    indentifiers: string[];
    languages: string[];
    relations: string[];
    subjects: string[];
    publishers: string[];
    contributors: string[];
    coverages: string[];
    rights: string[];
    sources: string[];
};

type BookContent = {
    styles: any[];
    structure: any[];
    sectionNames: string[];
    sections: any[];
};

type BookKey = string;

export class BookStore {
    metadataRecords = new Map<BookKey, BookMetadata>();
    contentRecords = new Map<BookKey, BookContent>();

    constructor() {
        makeAutoObservable(this, { contentRecords: false });
    }

    getBookMetadata(bookKey: BookKey) {
        return this.metadataRecords.get(bookKey);
    }
    setBookMetadata(bookKey: BookKey, metadata: BookMetadata) {
        this.metadataRecords.set(bookKey, metadata);
    }
    removeBookMetadata(bookKey: BookKey) {
        this.metadataRecords.delete(bookKey);
    }

    getBookContent(bookKey: BookKey) {
        return this.contentRecords.get(bookKey);
    }
    setBookContent(bookKey: BookKey, content: BookContent) {
        this.contentRecords.set(bookKey, content);
    }
    removeBookContent(bookKey: BookKey) {
        this.contentRecords.delete(bookKey);
    }

    getBookState(bookKey: BookKey): BookState {
        const metadata = this.getBookMetadata(bookKey);
        const content = this.getBookContent(bookKey);

        const isMetadataParsed = !!metadata;
        const parsedSections = content.sections
            .map((section, index) => (section.contents !== undefined ? index : undefined))
            .filter((item) => item);
        const isInitSectionParsed = !!parsedSections.length;
        const isFullyParsed = parsedSections.length === content.sections.length;
        const sectionNames = content.sections.map((section) => section.id);

        return {
            isMetadataParsed,
            isInitSectionParsed,
            isFullyParsed,
            parsedSections,
            sectionNames,
        };
    }
}
