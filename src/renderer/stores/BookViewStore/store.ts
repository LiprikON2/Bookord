import { BookViewStore } from "./BookViewStore";
// import { BookMetadataGetter, ExtractBookMetadata } from "./filters/metadataGetters";

// const metadataGetter = new BookMetadataGetter();

// export type BookMetadataType = ExtractBookMetadata<typeof metadataGetter>;

// export const bookViewStore = new BookViewStore(new BookMetadataGetter());

export const bookViewStore = new BookViewStore();
