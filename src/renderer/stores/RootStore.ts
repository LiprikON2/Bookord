import { BookStore } from "./BookStore";
import { BookViewStore } from "./BookViewStore";
import { BookReadStore } from "./BookReadStore";

export class RootStore {
    bookViewStore = new BookViewStore(this);
    bookStore = new BookStore(this);
    bookReadStore = new BookReadStore(this);
}
