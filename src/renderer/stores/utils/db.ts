import Dexie, { Table } from "dexie";

import { BookStoreData } from "../BookStore";

export class AppDatabase extends Dexie {
    BookStore: Table<BookStoreData, number>; // id is number in this case

    constructor() {
        super("AppDatabase");
        this.version(1).stores({
            // Keys to be indexed https://dexie.org/docs/Version/Version.stores()
            // BookStore: "++id",
            BookStore: "",
        });
        this.open().catch((err) => {
            console.error("Failed to open db: " + (err.stack || err));
        });
    }
}
