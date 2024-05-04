import { BookMetadata, BookStore } from "./BookStore";
import { BookViewStore } from "./BookViewStore";

export class RootStore {
    bookViewStore: BookViewStore<BookMetadata>;
    bookStore: BookStore;

    constructor() {
        this.bookViewStore = new BookViewStore(this);
        this.bookStore = new BookStore(this);
    }
}
