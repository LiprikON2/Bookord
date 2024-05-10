import { BookStore } from "./BookStore";
import { BookViewStore } from "./BookViewStore";
import { BookReadStore } from "./BookReadStore";
import { AppDatabase } from "./utils";

export class RootStore {
    db = new AppDatabase();
    bookViewStore = new BookViewStore(this);
    bookStore = new BookStore(this);
    bookReadStore = new BookReadStore(this);
}
