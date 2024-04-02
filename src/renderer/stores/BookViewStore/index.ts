import { ViewStore } from "./ViewStore";
import { BookMetadataGetter } from "./metadataGetters";

export const bookViewStore = new ViewStore(new BookMetadataGetter());

export * from "./ViewStore";
